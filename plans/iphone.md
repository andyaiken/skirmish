# iPhone

The game ships iPad-only (`TARGETED_DEVICE_FAMILY = 2`), and every iPhone is turned away at the
door by the size gate in `src/components/layout/layout.tsx:39`. Both of those are one-line changes.
Neither is the work.

The work is that the app has no responsive layout at all. Across the whole of `src/` there are
exactly two media queries, and both are `prefers-reduced-motion`. There are no breakpoints, 82
fixed pixel dimensions, and 13 declarations wider than an iPhone is. The layout was written for one
size class and it shows.

What makes this tractable is that the hard part is already done twice over: the encounter screen and
the setup screen both have full portrait variants, because the iPad supports portrait. The app
already knows how to stack. It just doesn't know how to be narrow.


## What already works in our favour

- **`card-list` is genuinely responsive.** `grid-template-columns: repeat(auto-fill, minmax(210px, 1fr))`
  collapses to a single column on a phone with no change at all. Card lists are most of the campaign
  screens, so most of the content is already fine.
- **The encounter screen has a portrait layout** (`encounter-screen.tsx:1073`) that stacks the map
  above the side columns. The structure we need exists; it is the proportions that are wrong.
- **The map is player-zoomable** — `mapSquareSize` runs 5–50 with a default of 15
  (`encounter-screen.tsx:213`). A 20×20 battle map is 300px at the default and 100px zoomed out, so
  the map itself fits a phone today.
- **`ScaleToFit`** already shrinks content to its container without enlarging it. It is the right
  tool for several of the fixed-width panels, and it is already written and tested in use.
- **`Selector` takes a `columnCount`**, so the four-page campaign nav can be told to wrap to two
  rows rather than squeezing four columns into 390pt.
- **Buttons are already 40pt minimum** (`index.scss`), which is above Apple's 44pt guidance only in
  the wrong direction — see Phase 4 — but is close.
- **The rotation refactor helps.** Since `Main` is now always rendered with the too-small message
  laid over the top, the game is *already running* underneath the gate on a phone. Hiding the
  overlay is enough to see the real layout — no scaffolding needed to start looking.

Worth knowing: `UISupportedInterfaceOrientations` (the non-`~ipad` key, which is the iPhone one) is
already set to portrait plus both landscapes. That key has simply been inert while the device family
excluded phones.


## The decision to make first

**Does an iPhone get the tablet layout made narrow, or its own layout?**

Everything downstream depends on this, and the current code can't express the question. The only
size concept in the app is `OrientationType`, derived from a media query and threaded through `Main`
as a prop. An iPhone in portrait is `Portrait` exactly as an iPad in portrait is, and the two want
very different things from 390pt versus 820pt of width.

**Option 1 — narrow the tablet layout.** Keep one layout, add breakpoints, let the panels shrink
and stack further.

- Cost: low. Mostly stylesheet work, concentrated in the fixed widths below.
- Risk: the encounter screen. In portrait the two side columns sit side by side
  (`encounter-screen.scss`, `.encounter-side-columns`), which on a phone is two ~190pt columns of
  dense combat detail. That is the layout that will feel cramped rather than small, and no amount of
  breakpoint tuning fixes two columns that shouldn't be two columns.

**Option 2 — add a size class, and give the phone its own treatment where it needs one.** Introduce
a `DeviceSize` (phone / tablet) alongside `OrientationType`, threaded the same way. Most screens
ignore it; the encounter screen uses it to turn the side panels into sheets that slide over the map
one at a time instead of columns beside it.

- Cost: moderate. The size class itself is small — it mirrors machinery that already exists. The
  encounter sheets are a real piece of work.
- Payoff: the encounter screen is where the game is actually played, and sheets-over-map is the
  pattern every phone game of this shape uses. It also leaves the iPad untouched, which matters
  because the iPad version is shipped and working.

**Recommendation: Option 2**, but build it in the order below so that Option 1's cheap wins land
first and you can judge the encounter screen on a real phone before committing to the sheets.


## Phase 0 — Look at it (done)

Before changing anything, find out how bad it actually is. The game already renders under the gate,
so this is just looking.

1. Temporarily short-circuit `isBigEnough` to `true` in `layout.tsx` (local only, not committed).
2. Run the dev server and walk all five screens — landing, setup, campaign (all four pages),
   encounter, backstage — at 390×844 and 844×390, plus 440×956 for the largest phone.
3. Screenshot each and write the defect list.

Output: a catalogue, not a fix. Expect it to be shorter than feared on the card pages and worse than
feared on the modals.

Note that the browser pane runs hidden, so anything animated won't advance on its own — that only
matters here for the carousel.

### Findings — done 28 October 2026

Walked all five screens at 390×844, 844×390 and 320×568, with the gate temporarily neutralised.
Measured rather than eyeballed: a script reporting every element wider than the viewport, plus
reachability checks on individual controls.

**The good news is larger than expected.** The campaign screen — four pages, the island map, and
most of the game's content — reported **zero** elements wider than the viewport at 390pt. The
`card-list` grid reflows to a single column on its own, the four-page selector wraps its labels to
two lines and fits, and the island map renders legibly. The encounter screen has no overflow either.
Nothing needs rebuilding; the structure is sound.

**Three things are functionally broken, not merely ugly.** These stop play rather than looking bad:

1. **Modals cannot be dismissed.** `.dialog` is 724px wide and centred with `translateX(-50%)`, so at
   390pt it sits at left −167, right 557 — hanging off *both* edges. The close button, positioned
   `right: 30px` inside it, lands at x 485–525, entirely beyond the 390pt viewport. Measured
   `reachable: false`. Confirmed on the packs modal and the Start an Encounter modal.
2. **Retreat is unreachable at 320pt.** The encounter toolbar clips its right-hand end (scrollWidth
   400 vs clientWidth 366 at 390pt). At 390pt that costs **Help**; at 320pt it costs **Zoom In,
   Retreat and Help**. Retreat is the only way out of an encounter.
3. **The campaign top bar clips** (scrollWidth 467 vs 390), taking the Help button with it.

**The landscape result is the surprise, and it changes the Phase 3 plan.** In landscape at 844×390
there is no overflow at all — and the game is still worse off than in portrait, because the side
columns are `flex: 0 0 250px` and `flex: 0 0 300px`. They do not shrink, so the battle map gets
**254px of 844px**: the two information panels take two thirds of a phone's screen and the game
itself gets the remaining third. The top panel takes another 75px of the 390px height.

This is the clearest argument yet for Option 2. Breakpoints alone will not fix it, because the
columns are doing exactly what they are told; what is wrong is that a phone should not be showing
both panels beside the map at all.

**Portrait at 390pt** puts the two side panels below the map at 171px and 205px wide, inside a
370px container — so they overflow their own row (scrollWidth 387) and combatant names break
mid-word ("KITH'NE / TH"). Cramped rather than broken, exactly as predicted, and the same argument
applies.

**Clipping, not scrolling.** `html`, `body` and `#root` are all `overflow: hidden`, so
`document.scrollWidth` stays at the viewport width throughout. Nothing that runs off the edge can be
scrolled back into view — it is simply gone. This is why the close button is unreachable rather than
merely awkward, and it means any audit that looks for horizontal scrollbars will report a clean bill
of health on a badly broken screen.

**Confirmed over-wide elements**, in the order they bite:

| Element | Width | Screen |
|---|---|---|
| `.dialog` | 724 | every modal |
| `.logo-text` | 564 | landing, setup |
| `.carousel` and its contents | 500 / 466 | landing, hero builder, help |
| `.left-panel`, `.right-panel` | 500 | setup |
| `.empty-panel`, `.expander`, information text | 500 / 476 | setup |
| `button.primary` | 418 | setup |

**Incidental find:** the encounter toolbar's right-panel button has `title="Right Panal"`. Worth
fixing whenever that file is next open.

**Revised order.** Nothing in the plan below changes except the weighting: the dialog fix is worth
more than the rest of Phase 2 combined, since it is what makes the game unplayable rather than
untidy, and the toolbar overflow should be promoted to sit beside it. Both are small.

### Both fixed — 28 October 2026

Done ahead of the rest of Phase 2, and both turned out to be smaller than the catalogue suggested.
No breakpoints and no size class were needed: each fix is a floor that gives way when there is not
enough room for it, so the iPad reaches the old value and a phone does not.

- **`dialog.scss`** — `min-width: 724px` became `min-width: min(724px, calc(100% - 20px))`.
- **The eight `width: 650px` card rows** became `width: min(650px, 100%)`, so a hand of three cards
  still sits in three columns where there is room and falls to the `card-list` grid's single column
  where there is not. Without this the dialog would have been dismissable but its contents clipped.
- **`encounter-screen.scss`** — the top panel went from `flex: 0 0 75px` to `flex: 0 0 auto` with
  `min-height: 75px`, and the toolbar gained `flex-wrap: wrap`. The children now stretch to the
  panel's height, which is what their `height: 100%` did while that height was fixed.

Measured before and after at five viewports:

| | 1024×768 | 768×1024 | 390×844 | 320×568 |
|---|---|---|---|---|
| Dialog width | 964 (unchanged) | 724 (unchanged) | 370 | 300 |
| Close button | reachable | reachable | **now reachable** | **now reachable** |
| Card row | 650 (unchanged) | 650 (unchanged) | 336 | fits |
| Toolbar buttons cut off | none | none | **none** (was Help) | **none** (was Zoom In, Retreat, Help) |
| Top panel height | 75 (unchanged) | 109 (**was clipped to 75**) | 154 | 154 |

Two things worth noting beyond the phone. The iPad **portrait** encounter screen was already broken
and nobody had noticed: its top panel is a column holding a 75px toolbar, a 5px gap and a 50px
action bar — 130px of content in a box fixed at 75px, overflowing onto the map. It now sizes to its
contents. And iPad landscape is byte-for-byte unchanged on every measure taken, which was the main
risk in touching shared stylesheets.

Also fixed in passing: the `title='Right Panal'` typo on the toolbar button.

Still outstanding from Phase 2: the landing/setup fixed widths (`.logo-text` 564, `.carousel` 500,
the two 500px setup panels).


## Phase 1 — The size class

Add the phone/tablet distinction and thread it through, with no visual change yet.

- A `DeviceSize` enum beside `OrientationType`, resolved in `layout.tsx` from the same
  `useMediaQuery` call that resolves orientation, and passed into `Main` the same way.
- The breakpoint is a short-edge test, not a width test, so it survives rotation: the existing gate
  already learned this lesson, and its comment explains why the iPad mini's 744pt short edge forced
  740 rather than 768. A phone is a device whose short edge is under ~500pt.
- Be careful of the trap the gate comment documents: during rotation the two queries don't update in
  the same instant, so a device briefly matches neither. Anything keyed off the size class must
  tolerate a frame of the wrong answer, and must not unmount `Main` on the strength of it.

This phase ships green: nothing looks different, and `npm run test`, `tsc --noEmit`, `npm run lint`
and `npm run build` all still pass.


## Phase 2 — The fixed widths

This is the mechanical phase, and it is where most of the breakage lives. Thirteen declarations are
wider than a phone:

| What | Where | Note |
|---|---|---|
| `min-width: 724px` | `controls/dialog/dialog.scss:15` | **The single biggest blocker.** Every modal in the app goes through `Dialog` — 12 files use it. |
| `width: 650px` ×8 | the `buy-*` modals, `enchant-item`, `level-up`, `hero-builder` card and equipment pages | One repeated idiom, so one shared fix rather than eight. |
| `width: 500px` | `carousel.scss:2` (plus `height: 370px`) | Used in the hero builder and help. |
| `width: 500px` ×2 | `setup-screen.scss:16,40` | `.left-panel`, and `.right-panel` in the portrait variant. |
| `min-width: 250px` | `encounter-screen.scss`, `.icon-section button:not(.icon-btn)` | Forces the encounter toolbar wider than a phone. |

`.playing-card` is `width: 200px; min-width: 200px` with a 2:3 aspect ratio. One card fits a phone;
two side by side do not. The `card-list` grid already handles that, but check the places that lay
cards out by hand.

Do the dialog first and in isolation — it will fix a dozen screens at once, and it is the change
most likely to have surprising knock-on effects on the iPad, which must not regress.


## Phase 3 — Screen by screen

In increasing order of difficulty, which is also roughly increasing order of how much it matters:

1. **Landing.** Nearly free; it already adapts the logo by orientation
   (`landing-screen.tsx:79`).
2. **Backstage.** Developer-only, so it can be left rough or left out.
3. **Campaign.** Four pages, mostly card lists that reflow on their own. The top bar
   (`flex: 0 0 60px`, `padding: 0 25px`, three groups with 25px gaps) will need to lose the money
   and branding groups or stack them. Give `Selector` a `columnCount` of 2.
4. **Setup.** Has a portrait variant already; needs the two 500px panels unpinned and the carousel
   dealt with.
5. **Encounter.** The real work, and where the Phase 0 catalogue and the Option 1/2 decision meet.
   Start by simply letting the existing portrait layout run at phone width and playing an encounter
   on a real device. If the two-column side panel is as cramped as expected, convert the side panels
   to one-at-a-time sheets over the map. The panels already collapse
   (`.encounter-right-column.collapsed`), so the state to drive it partly exists.

There are no component or layout tests — all 16 test files are logic — so verification here is
visual throughout. The simulator is the tool for Phase 3; the browser pane is fine for Phase 2.


## Phase 4 — Phone ergonomics

Things that are not layout but are not optional either.

- **The bottom safe area.** `index.scss:55` deliberately drops the bottom inset, with a comment
  explaining that on iPad it left an empty strip and that the home indicator fades out during play.
  An iPhone's home indicator is the only way out of the app and sits over whatever is at the bottom
  of the screen. Revisit this decision for phones specifically — it was made for the iPad and the
  reasoning does not transfer.
- **Landscape insets.** The Dynamic Island eats a real bite out of the left or right edge in
  landscape. The root already insets left and right, so this should hold, but verify on a device
  with an island rather than trusting it.
- **Touch targets.** 40pt buttons against Apple's 44pt guidance. Worth raising for phones; harmless
  on iPad.
- **Reachability.** Primary actions sitting at the top of a 6.9" screen are a long way from a thumb.
  The encounter toolbar is at the top today.
- **Text.** 15pt body with 0.5px letter-spacing, and 10pt uppercase card footers. The card footers
  will be the first thing to become unreadable when cards shrink.


## Phase 5 — Ship it

Only now does the gate come down.

1. `TARGETED_DEVICE_FAMILY = 1,2` in both Debug and Release (`project.pbxproj:400,425`).
2. Remove or re-scope the gate in `layout.tsx:39`. Decide whether any phone is still too small — a
   1st-gen iPhone SE is 320×568 and runs iOS 15, which is the deployment target, so it is in scope
   unless that is raised.
3. `npx cap sync`, and remember the Podfile `capacitor_pods` block is regenerated.
4. iPhone screenshots — a required asset, and a new set rather than a resize of the iPad ones. Read
   the current required sizes off App Store Connect rather than assuming; they change.
5. Test on real hardware, not just the simulator, with particular attention to the home indicator
   and to an encounter played start to finish.
6. The App Store listing is the same app record — adding a device family does not create a new one,
   and existing purchases and iCloud campaigns carry over untouched. Worth checking a campaign
   started on iPad opens on the phone, since the save is device-independent but has never been read
   on a 390pt screen.

The description says "for iPad and Mac" in two places (the listing and `docs/index.html:14`), and
both need updating when this ships.


## Sequencing

Phases 0–2 are worth doing as one run: they are cheap, they are mostly stylesheet edits, and they
end with something you can genuinely look at on a phone. Phase 3's encounter screen is the piece
that deserves its own decision point, informed by actually playing on hardware. Phase 4 is small but
easy to forget. Phase 5 is a day of asset work and a submission.

The risk to manage throughout is iPad regression. The iPad version is shipped, paid for, and
working, and every change in Phase 2 touches a stylesheet it shares. Check the iPad after each phase
rather than at the end.
