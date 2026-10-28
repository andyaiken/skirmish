# Responsive layout

**The goal is an app that lays itself out correctly at almost any width and height, and adjusts as
that changes - rotated, resized, split.** Running on a phone is the demanding case that forces the
issue, and the case this document tests against, but it is not the point. The Mac's window is
resizable today. An iPad can be given half a screen today. A folding phone changes size in the hand.
Shipping on iPhone is one consequence of getting this right, not the objective.

The work is that the app has no responsive layout at all. Across the whole of `src/` there are
exactly two media queries, and both are `prefers-reduced-motion`. There are no breakpoints, 82
fixed pixel dimensions, and 13 declarations wider than an iPhone is. The layout was written for one
size class and it shows. The game also ships iPad-only (`TARGETED_DEVICE_FAMILY = 2`), with every
iPhone turned away by the size gate in `src/components/layout/layout.tsx:39` - but both of those are
one-line changes, and neither is the work.

## The principle: ask how much room there is, not what device this is

The distinction decides whether a change serves the goal or only looks like it does.

A rule phrased as *"this is a phone, so stack it"* answers a question about hardware. It is right
until something arrives that the categories do not fit - a folding phone opened out, an iPad sharing
its screen, a Mac window dragged narrow - and then it is wrong in a way that no amount of tuning the
threshold fixes, because the threshold was never measuring the thing that mattered.

A rule phrased as *"there is not room for the panels beside the map, so put them over it"* answers a
question about space, and is right for all of those without any of them being enumerated.

Most of what is done already works this way, which is why it has held up: the `min()` floors adapt
at every width rather than at a breakpoint, the two screens that scroll do so whenever their content
is taller than they are, and the toolbar's buttons shrink by however much they need to. The parts
that do not - the size class defined as "is this a phone", the gate, and the encounter screen's
fixed side columns - are exactly the parts still outstanding.

**What this rules out, where CSS can express it:** a breakpoint chosen from a device's dimensions.
**What it rules in:** `min()`, `max()` and `clamp()` floors; grids that reflow by content width;
elements that scroll when they overflow; and, where CSS cannot ask the question, measuring.
`ScaleToFit` and `CardPreview` already measure their container with a `ResizeObserver`, so the
pattern is established in the codebase. Container queries would be the natural tool and are not
available: they need iOS 16 and the deployment target is 15.

What makes this tractable is that the hard part is already done twice over: the encounter screen and
the setup screen both have full portrait variants, because the iPad supports portrait. The app
already knows how to stack. It just doesn't know how to be narrow.


## `isSmall` now asks about space — and one global question isn't enough

`isSmall` was `(max-width: 500px), (max-height: 500px)`: a phone, measured by the dimensions phones
happen to have. It now asks whether there is room to lay the encounter screen out the roomy way,
with both thresholds derived in `OrientationLogic` from what that screen's parts need rather than
chosen from any device:

```
minMapWidth 350 + panelWidths 550 + gaps 30  =  930   // panels beside the map, in landscape
minPanelWidth 235 x 2 + gaps 30              =  500   // panels below it, two abreast, in portrait
```

The encounter screen sets them because it is the only screen that puts two panels beside or below
the map, so it is the first to run out of room; every other screen still has slack when it does.
Change a panel's width and these follow, which is the point.

Phones and tablets classify exactly as before. What changes is everything in between, which a rule
about phones never saw: a folding phone opened out at 890x626 is now `LandscapeSmall` rather than
`Landscape`, as is a window dragged to 800x700, and a tablet given a 320pt share of its own screen.

### But the architecture underneath is too simple, and here is the proof

The model is: classify the size once, globally, and each page renders one of a set of named layouts.
Most of that is right - a small set of named layouts per screen is far easier to reason about, test
and keep consistent than continuous adaptation everywhere, and CSS classes express it naturally.

The flaw is the word *once*. It assumes every page is asking the same question, and they are not:

| What is deciding | The question it actually asks | Axis |
|---|---|---|
| Encounter panels | room for two panels beside or below the map? | width |
| Campaign page selector | can I afford 77pt of height for a band? | **height** |
| Campaign top bar | room for branding, money and buttons across? | width, ~470 |
| Encounter toolbar | room for nine 40pt buttons across? | width, ~420 |

Four different questions, two different axes, four different numbers - and one class answering all
of them.

**Measured, not argued:** at 1200x400 the app now reports `landscape`, not `landscape-small`, so the
page selector stays a band across the top. But 400pt of height is precisely when a rail is worth
having. The old height-based rule got that shape right by accident; the new width-based one gets it
wrong for the same reason. Neither is really answering the selector's question.

### Done — screens now ask their own questions

The `orientation` prop became a `LayoutModel`, threaded the same way through `Main` and the seven
screens that took orientation before:

```ts
export interface LayoutModel {
	orientation: OrientationType;
	roomForPanelsBesideMap: boolean;
	roomForPanelsBelowMap: boolean;
	roomForSelectorBand: boolean;
	roomForBranding: boolean;
}
```

The answers rather than the dimensions, deliberately. A flag only changes when a threshold is
crossed; handing down the width would re-render every screen on every frame of a window drag, and
the campaign map alone is a thousand elements - the same cost `index.scss` already warns about for
transitions. If a screen ever needs genuinely continuous sizing it can use a `ResizeObserver`, as
`ScaleToFit` and `CardPreview` do, scoped to one element rather than the whole tree.

`LayoutLogic` holds the sizes and the sums they make. Every number is something the game draws:

| Threshold | Sum | Who asks |
|---|---|---|
| `widthForPanelsBesideMap` | 350 map + 550 panels + 30 gaps = 930 | encounter, via the size class |
| `widthForPanelsBelowMap` | 235 x 2 + 30 gaps = 500 | encounter, via the size class |
| `heightForSelectorBand` | 60 bar + 77 band + 450 content = 587 | campaign page selector |
| `widthForBranding` | 175 + 90 + 100 + 105 = 470 | campaign top bar |

`Layout` holds the hooks, so it asks all four every render and hands the answers down.
`OrientationType` keeps its four values as the default for screens whose question really is just
"roomy or not", and `OrientationLogic` went back to being about the enum alone.

**And a screen now names the layout it chose.** The campaign screen emits `page-rail` or
`page-band`, and the stylesheet keys on that instead of on `landscape-small`. This was not
cosmetic: at 1200x400 the markup had already started railing while the stylesheet, still watching
the size class, had not - the two had quietly parted company, which is exactly the failure the
whole change is about.

Measured afterwards, with the two shapes that disagree:

| Size | Size class | Selector | Branding |
|---|---|---|---|
| 1200x400 | `landscape` | **rail** - no height for a band | yes |
| 890x626 | `landscape-small` | **band** - height to spare | yes |
| 874x402 | `landscape-small` | rail | yes |
| 1024x768 | `landscape` | band | yes |
| 768x1024 | `portrait` | band | yes |
| 402x874 | `portrait-small` | band | no |

Both disagreements now resolve the right way, and neither could have under a single class.

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

Those landing and setup widths are now done too — see below.

### Phase 2 complete — 28 October 2026

The remaining four widths, same technique again:

- **`.carousel`** — `width: min(500px, calc(100% - 20px))`, so it keeps a gutter rather than sitting
  flush to both edges on a phone.
- **`.left-panel` / `.right-panel`** in setup — `min(500px, 100%)` and `min(320px, 100%)`.
- **The logo** was the one that needed thought, because its size is computed in `logo-panel.tsx`
  rather than set in CSS. The caller picks a size to suit the screen it is drawing on, so the cap
  belongs with it: every dimension is now `min(chosen, (100vw - 40px) * share)`, where `share` is
  that dimension's fraction of the panel's total width. The panel measures about seven times the
  font size with the wordmark in it, so this reads as "the largest size that still leaves 20px
  either side", and on any screen with room for the size that was asked for it does not bind at all.

  A first attempt capped against a flat `16vw`, which was wrong twice over: the real ratio is 7, not
  the 5.6 estimated, so it still overflowed by 22px a side; and *any* flat `vw` cap shrinks the iPad
  too — 13vw would have taken the landscape logo from 140px to 133px. Measuring caught both.

| | 1024×768 | 768×1024 | 390×844 | 320×568 |
|---|---|---|---|---|
| Logo font | 140 (unchanged) | 100 (unchanged) | 50 | 40 |
| Logo margins | 24 either side | 36 | 21 | 21 |
| Carousel | 500 (unchanged) | 500 (unchanged) | 370 | 300 |
| Setup panels | 500 / 320 (unchanged) | 500 / 500 (unchanged) | fits | 300 / 300 |
| Elements wider than viewport | none | none | **none** | **none** |

**No screen clips anything off-edge on a phone any more.** That was the Phase 2 milestone, and it is
the point at which this is worth putting on real hardware.

### Vertical space — found, scoped and fixed, 28 October 2026

Fixing the widths surfaced the other axis, and the first reading of it was too narrow. Landing was
measured at 320 and 390 and the problem reported as specific to 320x568. It is not. The setup
screen, with a full team of five, is taller than the screen it is on at **every** size an iPhone
comes in - and on an iPad held in portrait:

| Viewport | Device | Setup overflowed by |
|---|---|---|
| 375x667 | SE 2nd/3rd gen, iPhone 8 | 384 |
| 375x812 | 12/13 mini | 239 |
| 390x844 | 14/15/16 | 210 |
| 440x956 | 16 Pro Max, the largest iPhone | 107 |
| 768x1024 | iPad, portrait | 86 |

So a gate floor could not have fixed this: "Begin the Campaign" was cut off on every phone, the
biggest included, and on a portrait iPad. The cause was not the sizes but that neither screen
scrolls. The campaign screen was fine throughout only because its pages scroll internally.

**The fix** is `overflow-y: auto` on `.landing-screen` and `.setup-screen`. Capacitor's
`scrollEnabled: false` only turns off the webview's outer bounce; an element that asks to scroll
still does, which is how `.dialog-content` and `.tab-content` already work.

It sits on the screen rather than on the content inside it. Putting it on `.setup-content` meant
also capping that container with `min-height: 0`, which stopped it growing to its natural height and
introduced scrolling where there had been none. On the screen, a size with room for everything is
untouched: landing at 1024x768 still reports a scroll range of 0.

| | 1024x768 | 768x1024 | 375x667 | 320x568 |
|---|---|---|---|---|
| Landing: start card reachable | yes (no scroll) | yes (no scroll) | **yes** | **yes** |
| Setup: begin card reachable | **yes** | **yes** | **yes** | **yes** |

A measurement caveat worth remembering: `scrollHeight` reports no overflow on a container that is
clipped and does not scroll, so an element can be losing content while measuring clean. The iPad
landscape setup screen read as fitting exactly and was in fact 804px of content in 768px - the lost
36px being `.setup-content`'s bottom margin. Checking `scrollHeight` alone will understate this; the
reliable test is where a known element's rect actually falls.

### Decision: the gate keeps a floor above 568

The 1st-generation iPhone SE at 320x568 is out of scope. The gate's floor, when it is rewritten in
Phase 5, should admit a short edge from about 360 and a long edge from about 640 - which takes in
375x667 and everything above it, and excludes only the 320x568 SE.

Now that both screens scroll, 320x568 is no longer technically broken, so this is a product choice
rather than a forced one. It still looks like the right call: at that size the encounter screen's
side panels are 171 and 205 wide, and the start card needs a scroll to reach at all.

Note the deployment target is iOS 15, which the 1st-gen SE runs, so the gate is what excludes it -
not the target.

## Phase 1 — the size class — done 28 October 2026

`OrientationType` now carries four values rather than two:

```ts
export enum OrientationType {
	Landscape = 'landscape',
	LandscapeSmall = 'landscape-small',
	Portrait = 'portrait',
	PortraitSmall = 'portrait-small'
}
```

Putting the size into the orientation rather than beside it means a phone arrives everywhere the
orientation already does - all eight screens and pages take it and write it straight into their
class name - with nothing new threaded through `Layout`, `Main` and the screens.

The cost is that `PortraitSmall` is not equal to `Portrait`, and taken literally that quietly breaks
two things: the encounter screen's `=== OrientationType.Portrait` would fall through to the
landscape branch on a phone, and the eleven `&.portrait` / `&.landscape` blocks across seven
stylesheets would stop matching. `OrientationLogic` (in `logic/orientation/`, with tests, following
the `*Logic` convention) is what makes the four values safe:

- `isPortrait` / `isLandscape` - what the two behavioural checks now use instead of `===`.
- `isSmall` - for phone-specific behaviour, not yet used by anything.
- `getClassName` - a small orientation emits **both** names, `portrait portrait-small`. Everything
  already written against `.portrait` keeps applying on a phone, and `.portrait-small` is there for
  the rules that need to differ. Styling a phone is adding rules, not repeating working ones.
- `getOrientation(isLandscape, isSmall)` - combines the two media queries in `Layout`.

Small is `(max-width: 500px), (max-height: 500px)`: every iPhone has a short edge of 440pt or less
and the smallest iPad 744, and asking about either dimension rather than the width keeps the answer
the same whichever way up the device is held, so it does not change under the player's hands partway
through a rotation.

Verified by reloading at each size:

| Viewport | Class | Encounter layout |
|---|---|---|
| 1024x768 | `landscape` | side by side (unchanged) |
| 768x1024 | `portrait` | stacked (unchanged) |
| 390x844 | `portrait portrait-small` | **stacked** - the TSX branch and the `.portrait` rules both still apply |
| 844x390 | `landscape landscape-small` | side by side |

Nothing yet uses `portrait-small`, `landscape-small` or `isSmall`; they are the hooks Phase 3 hangs
the phone-specific encounter layout on.

### Resizing now re-evaluates it

What looked at first like the browser pane failing to re-run react-responsive's listeners turned out
to be real: the class read stale while `matchMedia` itself reported the new value correctly, because
react-responsive listens only for the query's own change event and that does not dependably fire
when a window is resized. **The Mac build's window is resizable**, so this was a live bug there -
resizing past a threshold did not re-evaluate the layout - not merely a testing nuisance.

`utils/media-query/media-query.ts` replaces it with a `useMediaQuery` of the same shape (taking the
query as a plain string rather than `{ query }`) built on `useSyncExternalStore`, listening for both
the query's change event and `resize`, and reading the query again each time. It re-renders only
when the answer actually changes, so dragging a window edge without crossing a threshold costs a
read and nothing more.

Verified by resizing with no reload: 1024x768 `landscape`, 390x844 `portrait portrait-small`,
844x390 `landscape landscape-small`, 768x1024 `portrait`. react-responsive is now unused - it is
still in `package.json`, and the bundle dropped 5.6kB once it stopped being imported.

### The gate has a blind spot for near-square screens

Worth recording before Phase 5 rewrites the gate. It is written as two rectangles - `(min-width:
1024px) and (min-height: 740px)` or `(min-width: 740px) and (min-height: 1024px)` - which between
them miss a screen that is large but close to square:

Worked through with the iPhone Duo's published figures. Its outer display is 1398x2034 at 460ppi
and its inner 1878x2670 at 430ppi; at @3x those are 466x678pt and 626x890pt, and @3x is the right
reading because it puts the outer panel at 153pt/inch, exactly an iPhone's, where @2x would give an
implausible 230. Opened out as a passport the long edge of the inner display is the horizontal one,
so it presents as 890x626.

| Size | Orientation | Passes the gate |
|---|---|---|
| 466x678 - Duo folded | `PortraitSmall` | no, rightly |
| 890x626 - Duo opened as a passport | `Landscape` | **no** |
| 626x890 - Duo opened, turned upright | `Portrait` | **no** |
| 744x1133 - iPad mini | `Portrait` | yes |
| 1024x768 | `Landscape` | yes |

So the size class reads the Duo correctly in both states, and the gate then turns it away in both of
its opened ones - its short edge of 626 clears neither 740 nor 1024. An iPad in Split View or Stage
Manager at an awkward size hits the same gap.

A short-edge/long-edge gate would need a short edge of about 600 to admit it, against an iPad mini's
744.

The fix when the gate is rewritten is to test the short and long edges rather than width and height
separately: a minimum short edge and a minimum long edge, which is orientation-agnostic and has no
square-shaped hole in it.

Admitting it would raise the harder question. `Landscape` is right by the rule - neither edge is
under 500, so it is not a phone - but it is the wrong treatment: the encounter screen's fixed 250
and 300 side columns would leave about 300pt of map out of its 890, against an iPad mini's 543 in
landscape. Better than a phone's 254, and still not enough. The device would pass as a tablet and
play like a phone.

That is the argument for keying Phase 3's encounter layout on how much room the map actually gets
rather than on the orientation, or even on the size class: a rule about the map's width would do the
right thing for a phone, for a folding phone opened out, and for an iPad sharing its screen with
another app, without any of them being enumerated.


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

There are no component or layout tests - all 16 test files are logic - so verification here is
visual throughout. The simulator is the tool for Phase 3; the browser pane is fine for Phase 2.

### Sliding panels, and what 'small' should come to mean

The intended end state for the encounter screen is that on a small layout the side panels slide in
over the map, one at a time, instead of sitting beside it and taking a fixed share of the width.
The panels already collapse, so some of the state exists.

That changes what the size class is for. Today `isSmall` means "this is a phone", on a short edge of
500. Once the panels slide, the question a screen is really asking is "is there room for the panels
beside the map?" - and that is not the same question, because it depends on which way up the device
is. Beside the map, the panels want 250 + 300 plus gaps; below it, in the portrait layout, they only
need to be wide enough to read.

The rule that follows is orientation-dependent:

```
small = landscape ? (width < ~1000) : (width < ~500)
```

Against every size that matters, this changes exactly one:

| Device | Size | Today | With the rule above | Map if panels stay fixed |
|---|---|---|---|---|
| Duo folded | 466x678 | `PortraitSmall` | `PortraitSmall` | - |
| **Duo open, as a passport** | **890x626** | **`Landscape`** | **`LandscapeSmall`** | **300pt** |
| Duo open, turned upright | 626x890 | `Portrait` | `Portrait` | - |
| iPhone 16 Pro Max portrait | 440x956 | `PortraitSmall` | `PortraitSmall` | - |
| iPhone 16 Pro Max landscape | 956x440 | `LandscapeSmall` | `LandscapeSmall` | 366pt |
| iPad mini landscape | 1133x744 | `Landscape` | `Landscape` | 543pt |
| iPad landscape | 1024x768 | `Landscape` | `Landscape` | 434pt |
| iPad 13in landscape | 1366x1024 | `Landscape` | `Landscape` | 776pt |

So the opened Duo becomes `LandscapeSmall` and gets the sliding panels, which is what it wants: with
fixed panels it would have 300pt of map out of 890, against a full iPad's 434. Turned upright it
stays `Portrait`, correctly - there the panels sit below the map and get about 313pt each, close to
an iPad's 374.

**This is deliberately not implemented yet.** Nothing consumes `isSmall` or the `-small` classes, so
changing the threshold today would be inert, and the constant should be whatever the sliding layout
turns out to need rather than the estimate above. The shape of the rule is settled; the number is
Phase 3's to set.

When it is implemented, compose it in JavaScript from separate queries rather than writing one
compound `(orientation: landscape) and (max-width: ...)` query - the orientation and the width
update independently during a rotation, and keeping them apart makes that easier to reason about
than a compound query that can briefly match neither.


### Run on an iPhone — 28 October 2026

First time the game has been on a phone. Device family is iPad-only, so it took two throwaway local
changes to get there - `TARGETED_DEVICE_FAMILY = "1,2"` and the gate lifted - both reverted after.
An iPhone 17 simulator, 402x874.

Everything from Phases 0-2 held up: the logo fits with margins, the carousel keeps its gutter, both
screens scroll to reach their cards, the toolbar showed every button including Retreat, and the
Start an Encounter modal - which was impossible to dismiss before - fits with its close button
reachable. The game is playable end to end on a phone.

Two things were fixed from what it showed:

- **The toolbar wrapped to two lines**, which cost the map a row of vertical space it can't spare.
  Now, on a small layout only, the padding and gaps go first and then the buttons shrink: nine
  buttons on one line at 402pt at their full 40pt, and at 375pt shrunk to 38pt, still one line with
  nothing cut off.
- **The campaign top bar dropped its branding** when upright on a phone. The bar has the branding,
  the money and the buttons to fit across it, and on a phone it couldn't: the packs badge was
  clipped and the help button was off the edge entirely. The name went first, and then the mark with
  it - once the name is gone the icon is decoration, and the player knows which game they opened.
  `space-between` then puts the money on the left and the buttons on the right with room to spare.
  Turned sideways the phone has the room, so the branding comes back; only upright does it go.

The toolbar fix needed a second go, and the reason is worth remembering. `.encounter-screen.portrait-small
.encounter-toolbar` is three classes, and so is the base `.encounter-screen .encounter-top-panel
.encounter-toolbar` that it was meant to override - an exact specificity tie, settled by source
order, which the base rule won. Nesting the override through `.encounter-top-panel` as well fixes
it. The existing `&.portrait` block already did this; it just wasn't obvious why until something
silently failed to apply. Worth copying the shape of the neighbouring block when adding to this
file.

**Still open, seen on the device:**

- The home indicator sits over the bottom of the screen, and `index.scss:55` drops the bottom safe
  area by choice - a decision made for the iPad, where it left an empty strip. On the landing screen
  the Help button runs flush to the bottom edge, inside the swipe-up zone. This is the Phase 4 item,
  now confirmed rather than predicted.
- The two side panels below the map are as cramped as the measurements suggested. That is what the
  sliding panels are for.

### The page selector becomes a rail when the phone is sideways

Turned sideways a phone has 874pt of width and 402pt of height, and the selector was spending about
77pt of the scarce one on a band across the top. In `landscape-small` it is now a rail of icons down
the left instead: the screen becomes a grid, the top bar spans both columns, and the content takes
back the height.

The selector's options were text-only, so this needed four icons chosen - `IconMap2`,
`IconBuildingCastle`, `IconUsers` and `IconBackpack` for Island, Stronghold, Team and Equipment.
Easily swapped if any of them reads wrong; they are picked in one list in `campaign-screen.tsx`.
The icons render only in the rail, so the iPad and a phone held upright keep their text labels
exactly as before. The star that marks a page with something waiting on it survives the move - it
is the only thing in the selector a player would miss - and each icon carries its label as a title.

The rail hugs its icons rather than stretching down the whole side, which otherwise left a tall
empty box beneath them.

The landing screen's logo went with it. It was sized by orientation alone - 140 in landscape, 100 in
portrait - and sideways on a phone 140 took a third of the 402pt of height before the bar's padding.
A phone now gets one size whichever way up it is held, 50, because it is the same screen either way.
Upright is unchanged to the eye: LogoPanel's width cap was already reducing 100 to about 52 there,
so the cap no longer binds and is back to being the safety net it was meant to be.

### Could the header sit around the Dynamic Island?

Measured on the iPhone 17 rather than guessed. The top inset is about 63pt - almost exactly the
60pt the bar itself is tall - and the island occupies the middle 126pt of the 402pt width, leaving
about 138pt clear either side. The bar's contents now sit at precisely those edges: the money group
is roughly 90pt and the buttons about 100pt, so both would clear the island comfortably. On this
device it would work, and it would buy back a bar's worth of height.

It is still not a change to make casually, for three reasons:

- **CSS cannot ask where the island is.** `env(safe-area-inset-*)` gives the four insets and nothing
  about the cutout's width or position, so any centre clearance is a hardcoded guess.
- **The notch generation breaks the guess.** The cutout on an iPhone 11 through 14 is far wider,
  around 210pt, with a shorter inset - leaving roughly 82pt clear a side, which the money group
  does not fit into. The constant that works here is wrong there.
- **It is a no-op on the small end.** The SE 3rd generation, which the gate floor admits, has no
  cutout, and with the status bar hidden its top inset is nil. Nothing to reclaim.

It also isn't a self-contained change: the inset is applied once for the whole app at
`index.scss:55`, so lifting one bar into it means moving that decision into the screens.

**Recommendation: fold it into the Phase 4 safe-area item rather than treating it separately.** That
item already exists for the bottom edge, where the home indicator overlaps the Help button, and it
is the same decision seen from the other end - the app-wide inset was chosen for an iPad and both
edges want revisiting for a phone. Worth doing together, with a real device per cutout generation
to check against.


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
