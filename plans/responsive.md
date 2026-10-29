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

### Decision: the gate keeps a floor above 568 — reversed, see Phase 5

This said the 1st-generation iPhone SE at 320x568 was out of scope, on the grounds that the
encounter screen's side panels were 171 and 205 wide there. That was true of the layout it was
written against, where the panels sat below the map in two columns. They are sheets over the map
now, and 250 wide at that size - above the 235 this document calls readable - so the reason the
decision rested on has gone.

It is admitted. The floor is in Phase 5, and it is 305 by 497 rather than 360 by 640 - measured
from what the game stops being able to draw rather than from which devices it was meant to take in.

Note the deployment target is iOS 15, which the 1st-gen SE runs, so the gate was what excluded it -
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
square-shaped hole in it. **Done in Phase 5; the Duo is admitted in both of its opened states.**

Admitting it would raise the harder question. `Landscape` is right by the rule - neither edge is
under 500, so it is not a phone - but it is the wrong treatment: the encounter screen's fixed 250
and 300 side columns would leave about 300pt of map out of its 890, against an iPad mini's 543 in
landscape. Better than a phone's 254, and still not enough. The device would pass as a tablet and
play like a phone.

That is the argument for keying Phase 3's encounter layout on how much room the map actually gets
rather than on the orientation, or even on the size class: a rule about the map's width would do the
right thing for a phone, for a folding phone opened out, and for an iPad sharing its screen with
another app, without any of them being enumerated.


## The campaign sidebar becomes a sheet on a narrow screen — 29 October 2026

The sidebar laid itself out as a row of sections below the content in portrait, which is right on a
tablet and wrong on a phone: at 402pt the island's three sections came out **210 / 119 / 210**,
scrolling 619px inside a 378px box with `overflow-x: hidden` - 241px of it unreachable, and the
middle column narrow enough to break text one character per line. It was long-standing iPad
behaviour rather than anything new; a phone was simply the first screen to expose it.

It now goes over the content as a sheet, the same idea the encounter screen already uses for its
panels: shut, a strip along the bottom naming what is behind it; open, it covers the lower part of
the page with the whole width to itself.

`CollapsibleSidebar` (in `controls/`) wraps each page's existing `getSidebar()` without touching the
markup inside it, so all four pages share one implementation. It takes:

- `collapsible` - `!layout.roomForSidebarRow`, so a tablet keeps the row it had.
- `summary` - what the handle says: the selected thing's name, or the page's.
- `openFor` - the selected thing's id. A change to something opens the sheet, because the player
  just asked to see it; a change to nothing shuts it, which is what tapping the content does. The
  same rule the encounter's right-hand panel follows when a round is waiting on the player.

`widthForSidebarRow` is `(minPanelWidth x 2) + layoutGaps` - room for two readable panels abreast,
which is the common case. Same arithmetic as the encounter's panels-below-the-map and the same
reasoning, but a different question about a different screen, so it is named separately and is free
to diverge.

Measured at 402x874, with the island's three sections:

| | Before | After |
|---|---|---|
| Map height | 315 | **711** |
| Section widths | 210 / 119 / 210 | **358 / 358 / 358** |
| Clipped, unreachable | 241px | **none** |

Verified: shut by default on all four pages; opens itself when a region is selected; shuts when the
map is tapped; the handle toggles it; iPad stays inline and unchanged at both 768x1024 and 1024x768;
and widening with the sheet open returns to the inline row without leaving it open behind.

Two things worth knowing:

- **The sheet is capped at 55% of the page.** The content behind it is centred in its box, so a
  taller sheet hides it completely and the page reads as empty rather than as covered - at 75% the
  island map disappeared entirely behind it.
- **The override needed four classes.** The rules it replaces are `.campaign-map-page.portrait
  .sidebar` and its three siblings, at three; a tie would have been settled by whichever stylesheet
  the bundler put last. This is the second time that has come up, after the encounter toolbar.


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
   The two-column side panel was as cramped as expected, so the side panels - and the hand with
   them - are now one-at-a-time sheets over the map. Done; see the end of this phase.

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

**Done - see below.** The number never had to be set: `widthForPanelsBesideMap`, which `LayoutLogic`
already derives from the map's floor plus both panels, says 930 where this estimated ~1000, and it
says it as a sum of what the game draws rather than as a guess. So the size class was already asking
exactly the question the sliding layout needed, and the layout consumes `isSmall` as it stands.

The rule is composed in JavaScript from separate queries rather than written as one compound
`(orientation: landscape) and (max-width: ...)` query - the orientation and the width update
independently during a rotation, and keeping them apart is easier to reason about than a compound
query that can briefly match neither.


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
  the Help button runs flush to the bottom edge, inside the swipe-up zone. This was the Phase 4
  item, now confirmed rather than predicted - and since fixed there.
- The two side panels below the map are as cramped as the measurements suggested. That is what the
  sliding panels are for - now built, below.

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


### The panels now slide over the map — 28 October 2026

The Phase 3 item, and the last thing on the encounter screen that was broken rather than merely
tight. On a small layout the two side panels and the hand of action cards are no longer laid out
beside or below the map: they are sheets over it, one at a time, and the map has the whole screen
underneath.

**What it was.** Measured in a real encounter, on a hero's turn with the hand showing:

| | Map | The panels |
|---|---|---|
| 402x874 | **382x138** | 171 and 205 wide below it, overflowing their own 382pt row |
| 874x402 | **284x4** | 250 and 300 beside it, the hand taking everything else |

Four pixels of map. Sideways on a phone the game had no board at all, and no arrangement of two
fixed columns and a 335pt hand inside 297pt of height was ever going to give it one. The portrait
reading is the one the earlier audit predicted; the landscape one is worse than predicted, because
the audit was taken before initiative had been rolled and the hand was not yet on screen.

**What it is now**, the same encounter at the same sizes:

| | Map | Map behind an open sheet | The sheet |
|---|---|---|---|
| 402x874 | 382x735 | 382x735 | 320 wide, full height |
| 874x402 | 854x242 | 854x242 | 320 wide, 534pt of map still showing |
| 890x626 - Duo opened out | 870x466 | 870x466 | 320 wide, 550pt showing |
| 375x667 | 355x473 | 355x473 | 305 wide - the `calc(100% - 50px)` floor binding |

The map never changes size when a panel opens or closes, which is the substance of the change: the
panels cost it nothing now, where before they cost it two thirds of the screen.

**It asks the question the size class already answers.** `OrientationLogic.isSmall` is exactly "there
is not room for the panels where this orientation would put them" - that is what makes a layout
small - so the screen needed no threshold of its own, and the estimate in the design note above was
never needed. Change a panel's width and `LayoutLogic` moves the threshold, and the sheets follow.

What had to be decided, and what was decided:

- **Nothing starts open.** Over the map only one panel fits, so opening all three by default is not
  available; the map gets the screen and the toolbar's three buttons fetch what is wanted. An
  encounter still opens on something to do, because the round controls show themselves whatever the
  state says.
- **One at a time, enforced twice.** Showing one panel puts the others away. That covers the taps;
  it does not cover a window dragged narrow or a device rotated, which arrive at this layout
  carrying whatever was open while there was room for all three. So the screen also puts the extras
  away when it finds them stacked, keeping the right-hand one - that is where the current turn is
  played. Verified by opening all three at 1024x768 and resizing to 402x874: one sheet, the right.
- **A panel the player opened wins over the one that shows itself.** The right-hand panel ignores
  its own toggle when the encounter has ended or the round is waiting to be rolled, which is right -
  those are the only way on - but it would then sit under or over a panel the player had just asked
  for. Opening one takes precedence, so no tap looks like it did nothing. Retreating at 402x874 puts
  the confirmation up with OK and Cancel both reachable, which is the case that matters: Retreat is
  the only way out of an encounter.
- **The collapsed right-hand strip goes.** Beside the map a closed right panel leaves a narrow
  column showing whose turn it is. Over the map there is nothing to leave it in, and 60 of 382pt is
  too much of the board to spend on it, so on a small layout it is simply not drawn.
- **The hand is the third sheet, and is allowed the whole board.** Collapsed it stays in flow as the
  45pt strip of card tops it already was, along the bottom of the map; expanded it slides up over
  the map. The two at the sides always leave 50pt of board showing, because a panel wants reading
  against the board behind it. The hand does not: the cards keep their own size, and their text with
  it, and looking at your hand is a moment of its own.

**The iPad is untouched**, which was the risk in editing a shared stylesheet. Every new rule is
inside the existing `&.portrait-small, &.landscape-small` block, and the full-sized layouts render
the same markup as before - the map was lifted into a method of its own only because three layouts
now draw it. Measured with all three panels open: 1024x768 gives left 250, right 300, map 434x318,
hand 434x335, and 768x1024 gives side columns of 369 each inside a 748pt row with nothing
overflowing. Both are what they were.

**The hand says which way it runs rather than telling you to scroll it.** The row used to carry a
banner reading *Scroll left and right to see all the action cards in your hand* - 25pt of a phone's
scarcest dimension spent on a sentence, shown whether the row had anything past its edge or not.
It is now a chevron at whichever end has more: `ActionControls` watches the row's `scrollLeft`
against its `scrollWidth` and shows one, both or neither. Each is a button, and pressing it moves
the row on by a card - a card's width plus the gap after it, read from the row rather than written
down, so it follows whatever size the cards are. There is no disabled state, because an arrow with
nowhere to go isn't drawn in the first place.

It fades the end of the row out rather than sitting on top of a card as a button usually would,
which gives the chevron something plain to be read against; the gradient is the board colour
because that is what is behind the row, beside the map and inside the sheet alike. At
`--touch-target` wide it does take the far edge of the card underneath, which is a fair trade -
that edge is exactly where you reach when there is more to see. The scroll is smooth for a player
who hasn't asked for less motion, by the system setting or the game's own, and otherwise the row
simply arrives; dragging it is unaffected either way.

Measured by pressing them: at the left end the right arrow alone, and a press moves the row 210pt,
which is a 200pt card and the 10pt gap; four presses reach 710 of 710 and the right arrow goes;
a press on the left brings it back to 500 with both showing. On an iPad the step clamps at the end
of a shorter row, 156 of 156 in one press. Neither arrow is drawn where nothing is past the edge -
an iPad with an action chosen fits its 926pt of content in 926pt. They work in the two states the
banner never appeared in, where the chosen card and its details also run past the edge. Losing the
banner gave the hand's 25pt back: the sheet is 310pt rather than 335 on a phone, and an iPad's map
went from 318 to 343.

### A closed panel leaves a strip, and what decides whether it may — 28 October 2026

Two of the three panels already had a collapsed mode and the left one didn't: closing it returned
`null`, so the space went to the map and the player was told nothing. The right-hand one is the
opposite - collapsed is as small as it gets, and it can never be fully hidden. The left panel now
leaves a strip too, a column of `MiniToken`s in the order the initiative list holds them: whose
turn it is, who is next, who is down. The current one marks itself, because `MiniToken` reads
`combat.current` whether or not it is being drawn on a map.

The two that existed are not actually the same pattern, which is worth knowing before copying
either. The hand's is a **peek** - the top 45pt of the real cards, clipped, with `pointer-events`
off - and it works only because a card's top edge is its title. The right-hand one is a
**summary**: not the panel clipped at all but a substitute rendering, `CombatantRowPanel`'s
`column` mode, of the single fact worth keeping. The left-hand one is both at once, which is why
the tokens could come straight from the list it stands in for.

**What decides whether a strip may have its place is the share of the board it takes**, which is
the same question the rest of the layout asks, pointed at something else:

| | Strip | The map beside it | Share |
|---|---|---|---|
| Left, iPad 1024x768 | 60 wide | 624 wide | 9% |
| Right, iPad 1024x768 | 68 wide | 926 wide | 7% |
| Hand, iPad | 45 tall | 584 tall | 8% |
| Hand, phone 402x874 | 45 tall | 656 tall | 7% |
| A side strip on a phone | 68 wide | 382 wide | **18%** |

Every strip that exists costs about the same tenth of the board. A side strip on a phone costs
nearly a fifth of it for one combatant's name, which is why the right-hand one goes when the panels
become sheets, and why the left-hand one is not drawn there either - measured at 402x874, closing
it still leaves the map its full 382. The hand keeps its strip on a phone because 45pt of 656 is
the same seventh of nothing that the others cost.

A token in the strip selects that combatant, as it does in the list; `MiniToken` stops the click,
so the strip's own handler - which opens the panel - sees only the clicks that missed. The cursor
says `e-resize`, which reads as *pressing this makes it bigger that way*, matching `w-resize` on
the right-hand strip and `n-resize` on the hand.

**The slide** is a 0.2s transform, which composites rather than putting the map's several hundred
elements through layout - the distinction `index.scss` draws at the top of the file. It is off for
anyone who has asked for less motion, by either the system setting or the game's own option; the
sheet then simply appears.

**Two toolbar buttons that did nothing, found by looking at the sheets and fixed.** Both pre-date
this change and both were there on the iPad too; the sheets made the first one obvious, because a
panel that will not go away reads differently from a column that was always beside the map.

- The right-hand panel shows the round controls, or the end-of-encounter ones, whether or not it has
  been asked to - from either of those there is no other way on. So between rounds its button flipped
  its own icon and nothing moved.
- The bottom panel holds the hand of whoever's turn it is, so on a monster's turn there is nothing
  for its button to show at all.

Both are now drawn from what the screen is showing rather than from the flag behind it: the button is
`disabled`, which the toolbar already does for Zoom at the ends of its range and `index.scss` already
dims to half opacity, and the right-hand icon reads as open while the panel is up. The conditions
live in `hasFixedRightControls` and `hasBottomControls`, and `getBottomControls` is built from the
second of them, so the button and the panel cannot drift apart - which is the same failure the page
selector had when the markup railed and the stylesheet did not. `getEncounterState` came out of the
three copies of the manual-override check while they were being read.

| State | Left Panel | Bottom Panel | Right Panel |
|---|---|---|---|
| A hero's turn | enabled | enabled | enabled |
| A monster's turn | enabled | **disabled** | enabled |
| Between rounds, waiting on Roll Initiative | enabled | **disabled** | **disabled**, icon reads open |
| Encounter over | the toolbar is the logo instead |

**Three rough edges, all measured, none of them losing anything:**

- At 402pt of height the hand doesn't quite fit: 310pt of cards in the 276 the sheet has once the
  home indicator's strip is out, so it scrolls 34pt to reach the card footers. Shrinking the cards
  instead was tried on paper and rejected: a card's text does not scale with it, so a 141pt card
  trades a short scroll of the hand for a permanent one inside every card.
- With an action chosen, the card and its details column are 580pt of content in a 372pt row, so Go,
  Cancel and the two select-on-map buttons need a horizontal scroll. All four measured reachable,
  and the row already tells the player to scroll it.
- Choosing a target from the hand while sideways on a phone means collapsing the hand to see the
  board, because there the hand covers it. Upright there is room for both: at 402x874 the map shows
  the action's whole area of effect above the sheet.

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

### All five done — 28 October 2026

Measured at 375x667, 402x874 and 874x402 with the insets a phone actually reports, and checked at
1024x768 and 768x1024 after each one. `env()` cannot be given a value to test against, so the
bottom inset is now read through `--bottom-inset`, which can be - that is half the reason for
naming it.

**The bottom safe area.** `#root` dropped it on the grounds that every screen ends in scrolling
content, which can run under the home indicator because only a swipe from the edge goes home. Two
screens don't, and measuring found both:

| | Where it sat | The strip is |
|---|---|---|
| Landing, scrolled to the end | Help button at 824-864 | 840-874 |
| Encounter, hand collapsed | the strip that opens it, 824-874 | 840-874 |

The hand's strip was wholly inside it - the one control in the game you press most and the hardest
to press. It is now folded into each screen's own bottom spacing with `max()` rather than put back
at the root, for two reasons. The root's inset would have *added* to the 10pt the screens already
have, so a phone would lose 44pt where it needs 34; and the author's objection to the strip was that
every screen got one whether it needed it or not. Four screens take it, and what it costs them:

| | Before | After | Cost |
|---|---|---|---|
| Landing, 402x874 | Help at 824-864 | nothing below 840 | scroll extent only |
| Encounter, 402x874 | map 382x680 | map 382x656 | 24pt |
| Encounter, 874x402 | map 854x242 | map 854x231 | 11pt |
| Encounter, 1024x768 iPad | map 930x608 | map 930x598 | 10pt |

**Landscape insets - they hold, and the size class doesn't.** The layout itself is fine inside
them: simulated at 956x440 with 62pt either side, every screen laid out in the 832pt that leaves
with nothing clipped. What is not fine is the question being asked. The media queries in
`LayoutLogic.queries` measure the **viewport**, and the app lives inside the safe area, which on
the biggest iPhones in landscape is 124pt narrower:

| | Viewport | Usable | Size class | Map, both panels open |
|---|---|---|---|---|
| iPhone 16/17 Pro Max landscape | 956 | **832** | `Landscape` - roomy | **242pt** |

So the one device the 930pt threshold exists to protect is the one it lets through: 956 clears it,
832 does not, and the map ends up at 242 against the 350 floor the threshold is built from. Every
other size is unaffected - an iPad reports no side insets, and the folding phone at 890 is already
below the threshold either way. **Fixed; see below.**

### The questions are asked of the room now, not the window — 28 October 2026

`utils/available-space/available-space.ts` measures `#root`'s content box - the element the safe
area is taken out of, so the one that knows how much is left - and answers `useWidthAtLeast`,
`useHeightAtLeast` and `useIsLandscape`. `LayoutLogic.queries` is gone with the media queries that
used it; what is left there is what the file was always for, the sizes and the sums they make.

Deliberately the same shape as `useMediaQuery`, down to the `useSyncExternalStore` and the
`useCallback`: each hook answers one threshold with a yes or no rather than handing back a size, so
a render happens only when a threshold is crossed and dragging a window edge costs a measurement
and nothing more. The alternative - handing the width down - would re-render every screen on every
frame of a drag, which is the thing Phase 1 wrote the flags to avoid.

It listens for a resize, as `useMediaQuery` does, and also observes `#root` with a `ResizeObserver`.
The observer is there for the case the resize event cannot catch: on iOS the safe area can settle a
frame or two after a rotation, and a `resize` has been and gone by then. It also means the width and
the height always come from one measurement, so they cannot disagree the way two media queries can
partway through a rotation.

Measured by simulating the insets - which is the other half of why `--bottom-inset` is a named
property rather than `env()` at each use, since `env()` cannot be given a value to test against:

| Viewport | Insets | Room | Was | Now |
|---|---|---|---|---|
| 956x440 | none | 956x440 | `landscape` | `landscape` |
| 956x440 | 62 a side | **832x440** | `landscape` | **`landscape-small`** |
| 956x440 | 31 a side | 894x440 | `landscape` | **`landscape-small`** |
| 874x402 | 59 a side | 756x402 | `landscape-small` | `landscape-small` |
| 402x874 | 63 top | 402x811 | `portrait-small` | `portrait-small` |
| 890x626 | none | 890x626 | `landscape-small` | `landscape-small` |
| 1024x768 | none | 1024x768 | `landscape` | `landscape` |
| 768x1024 | none | 768x1024 | `portrait` | `portrait` |

The height question moved with it, and it was wrong in the same way for the same reason. At 900x620
the campaign selector is a band; give it the 63pt top inset a phone has and the room is 900x557, 30
short of the 587 a band needs, and it is correctly a rail. 1200x400 still rails and 1024x768 still
bands, as the Phase 1 table says they should.

One thing it does not cover, on purpose: the measured height is short by whatever strip the screen
reserves for the home indicator itself, because `#root` doesn't carry that one - the top inset,
which is the larger of the two, is in it.

The gate was the other, and only until Phase 5 reached it: it asked the window here because its
numbers had been chosen against window sizes, and re-scoping it was that phase's. It now asks the
room like everything else, through `useEdgesAtLeast`.

A note for whoever tests this next: the browser pane does not run rendering steps - a
`requestAnimationFrame` never fires in it - so a `ResizeObserver` callback cannot be delivered there
at all. The resize listener is the path these measurements exercised; the observer is reasoned
about rather than tested, and wants a real device or a browser window that paints.

**Touch targets.** `button` now asks for `--touch-target`, 44pt, rather than 40. The four places
that pinned an icon button's width to 40 take the same value, so they stay square, and
`LayoutLogic.minTouchTarget` carries the same figure into the sums the layout is made of -
`topBarButtonsWidth` is two of them plus the gap, so `widthForBranding` moved 470 to 473 on its own.

Two things the audit turned up that the 40pt figure had hidden. The carousel's controls opt out of
the app's button sizing altogether: its arrows were 32x32 and its **dots 8x8**, by some way the
smallest targets in the game. The arrows are now 44 square and a dot is 8px of paint inside a 24x44
button, with the gap between dots replaced by the unpainted part of each target so the two can't
drift apart. And the encounter toolbar is the one place that stays below the guidance: nine buttons
at 44 is 396pt and will not cross a phone, and the second line that would buy costs the map more
than 4pt is worth. It keeps 40, and 38 at 375pt, as it did.

| | Before | After |
|---|---|---|
| Buttons generally | 40 | 44 |
| Carousel arrows | 32x32 | 44x44 |
| Carousel dots | 8x8 | 8px dot, 24x44 target |
| Encounter toolbar, 402pt | 40x40, one line | unchanged |
| Encounter toolbar, 375pt | 38x40, one line | unchanged |

**Reachability.** On a small layout the top panel is now the bottom one: `order: 1`, nothing more.
It carries the toolbar and the button that ends your turn - the two things pressed most in an
encounter - and at the top of a 6.9in phone they are the far corner of the screen. The order inside
the panel already puts the toolbar above the action button, so at the foot of the screen the action
button is the nearer of the two. At 402x874 the map now runs 10-666, the hand's strip 676-721 and
the controls 731-840: board, then hand, then the controls under the thumb. The sheets are unaffected
- they are inside the main panel, so they slide over the map and stop above the toolbar, which
stays visible to close them with. A tablet keeps it at the top, where the whole screen is within
reach of the hand holding it and the map wants the lower half.

**Text.** The worry recorded here was that the card footers would go first when cards shrank. They
didn't shrink - the hand slides over the map rather than being squeezed beside it - so the only
thing to do was the footers themselves, at 10px the one thing in the game below the 11px floor
Apple gives for text at all. They are 11px now, measured at 375pt with nothing clipped. What is in
the app otherwise: 11px tags, 12px stat labels, 15px body, 17-18px headings. Nothing else is under
11, and raising the 15px body would reflow every width Phase 2 measured, for a gain nobody has
asked for.

Worth recording for later rather than fixing now: every size in the app is in `px`, so a player who
has set a larger text size system-wide gets nothing. Supporting Dynamic Type means typography in
relative units throughout, which is its own piece of work.


### The dialog title and its close button — 29 October 2026

The close button is laid over the dialog's top-right corner and nothing reserved room for it, so a
title wide enough to reach it ran underneath: at 440pt the X sat on the last letter of 'Start an
Encounter'. The title now gives up the button's width and inset, and only on that side - taking it
from both keeps the title on the dialog's centre line, but at 320pt that leaves 152 for it. Only a
dialog that has a button pays for it, which is what the `closable` class is for.

That alone was not enough, and it took two goes to find out why: a title is 30px with 5px of
tracking, so 'ENCOUNTER' by itself wants 207 of the 192 left once the button's side is taken out,
and the word broke across lines mid-letter. Capping the title at `min(30px, 7.5vw)` fixed that, and
then both workarounds were thrown away for the thing that made them unnecessary.

### The content reserves the button's corner

Both of those were the same workaround twice: the button was laid over the dialog's corner, so
anything that reached the corner had to be told to avoid it, and what it gave up to do so was the
width it needed to break on whole words.

A header row holding the button was tried first and thrown away. It fixed the overlap, but it left
the button marooned in a row of its own with the width beside it empty, and the title pushed below
it - 59px of nothing on every dialog that has a close button. The title belongs in that row, and
could not get there: of twenty-five dialogs most keep their heading inside a modal component rather
than at the call site, and two of those components are used in three and four places, so giving
them a `title` prop means changing call sites that have no dialog in them at all.

What is there instead: the button stays pinned to the corner, and the content reserves that corner
with a floated shape of the same size. The first line of whatever starts the dialog - a title,
every time so far - is shortened by exactly the button's box and flows around it; every line after
it has the full width back. That is what padding the title could not do, because padding shortens
every line, and what cost 'ENCOUNTER' the room to stay in one piece.

A float rather than putting the button itself in flow, because it has to stay where it is while the
content scrolls: measured through 2278px of scrolling in the help dialog, it does not move.

The title is back at the 30px it was designed at, at every width:

| | Title | Lines | Overlap |
|---|---|---|---|
| 320x568 | 30px | 2, on whole words | none |
| 1024x768 | 30px | 1 | none |

Checked on the help, card packs and start-an-encounter dialogs, which differ in what their content
starts with. The float changes nothing below the first line: with it and without it, every element
in the start-an-encounter dialog sits at the same place to the pixel.


## Phase 5 — Ship it

Only now does the gate come down.

1. ~~`TARGETED_DEVICE_FAMILY = 1,2` in both Debug and Release.~~ Done, in Debug and Release.
2. ~~Remove or re-scope the gate in `layout.tsx`.~~ Done; see below. No phone is too small now -
   the 1st-gen SE included, once the two things that were actually broken at that size were fixed.
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

### The gate comes down — 28 October 2026

The rule it is built on: **restrict the app only at a size where it is genuinely unplayable**, not
merely cramped. A screen that is tight is one a player may still want to play on, and the gate is
not the place to make that choice for them. That turned the question from *which devices should be
let in* into *where does the game stop working*, which is answerable by measuring.

`TARGETED_DEVICE_FAMILY` is `"1,2"` in Debug and Release.

**Two things were genuinely broken at 320x568, and neither was the gate's business.**

- **The island map was 296x16.** `.campaign-map-page .sidebar` was `flex: 0 0 365px` in portrait -
  a fixed height that would not give way - so on a 568pt screen the map got whatever was left,
  which was nothing. The map is what you press to start an encounter, and the panel below it is
  text that scrolls, so the map now keeps a floor of 200 and the panel gives way to it. At 320x568
  the map is 296x196 and the panel 161, scrolling 551 inside it. This is the same fixed-pixel
  failure as the rest of Phase 2, in a screen nobody had looked at this short.
- **The page selector ran off the edge.** `repeat(4, 1fr)` has an implicit minimum of the content's
  own width, so the four labels came to 330 in a 294 band and Equipment hung past the screen. The
  selector now wraps to two rows of two when four across won't fit, which is `columnCount` doing
  what Phase 3 said it was for. Measured: 2 columns of 145 at 320, 4 at 375 (73/100/73/98 in 349,
  which is where the 350 threshold comes from), 4 of 248 on an iPad.

With those fixed, 320x568 plays: the encounter map is 300x374, the toolbar fits all nine buttons on
one line at 32pt with Retreat on screen, the sheets are 250 wide against the 235 this document
calls readable, the hand needs no scroll, and the Start an Encounter modal fits with its close
button reachable.

**The floors, measured rather than chosen.** Each is a sum of things the game draws, and each marks
where something stops being there rather than merely getting tight:

| | Sum | |
|---|---|---|
| `minShortEdge` | 235 readable panel + 50 map strip + 20 screen padding | **305** |
| `minLongEdge` | 60 top bar + 97 selector wrapped + 200 island map + 100 panel + 30 gaps + 10 | **497** |

The short edge is the encounter screen: a sheet is `min(320px, calc(100% - 50px))` of the main
panel, so at 280 the panels are 210 and at 320 they are 250 - 305 is where they reach 235. The long
edge is the campaign screen, which runs out first and is where an encounter is started from: at 500
the panel under the island has 93 and scrolls, at 440 it is down to two lines and the page is being
clipped.

**The gate itself** is `useEdgesAtLeast(minShortEdge, minLongEdge)` - a short edge and a long edge
rather than the two overlapping rectangles it used to be, so the answer doesn't change as a device
turns over and there is no square-shaped hole between them. Of the room rather than the window,
like everything else now. `utils/media-query` is deleted; the gate was its last caller.

Verified by resizing, with nothing hidden:

| Size | | |
|---|---|---|
| 320x568 | the smallest iPhone | playable |
| 568x320 | the same, sideways | playable |
| 890x626 and 626x890 | the folding phone opened out | playable - both states the old gate refused |
| 1024x768, 768x1024 | iPad | playable |
| 300x900 | too narrow for a readable panel | blocked |
| 320x480 | no room for the island and its panel | blocked |

**Still to do in Phase 5:** `npx cap sync` (left for whoever next builds, since it rewrites
generated files in the iOS project), the iPhone screenshots, testing on real hardware, and the two
places the description says "for iPad and Mac".


## Sequencing

Phases 0–2 are worth doing as one run: they are cheap, they are mostly stylesheet edits, and they
end with something you can genuinely look at on a phone. Phase 3's encounter screen is the piece
that deserves its own decision point, informed by actually playing on hardware. Phase 4 is small but
easy to forget. Phase 5 is a day of asset work and a submission.

The risk to manage throughout is iPad regression. The iPad version is shipped, paid for, and
working, and every change in Phase 2 touches a stylesheet it shares. Check the iPad after each phase
rather than at the end.
