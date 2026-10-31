# Submitting 1.1.0 — the iPhone release

Where the work stands as of 30 October 2026, written as a handover so a fresh session can pick it
up without the history behind it. The UI work is finished; what is left is assets and paperwork.

## Done

- **Every screen adapts to the space it has**, upright or sideways, on a phone or a tablet. The
  reasoning and the measurements are in `responsive.md`, which is the record of that work.
- **`TARGETED_DEVICE_FAMILY = "1,2"`** in Debug and Release.
- **Version is 1.1.0, build 6** (`MARKETING_VERSION` / `CURRENT_PROJECT_VERSION`, both configs).
  1.0.2 is already approved, so a new upload needs its own version - do not reuse 1.0.2.
- **`npx cap sync` has been run.** It moved the native pods from Capacitor 8.5.2 to 8.5.3, matching
  `package.json`. `Podfile.lock` is committed. The Podfile itself was not touched.
- **iPhone screenshots** are in `screenshots/iphone-6.3/`, five of them at 1206x2622 (a supported
  size for the 6.1"/6.3" slot): landing, setup, island, encounter, hero.
- **`docs/index.html`** says "for iPhone, iPad and Mac".
- Lint clean, 347 tests passing, Release builds for iOS.

## Still to do

-. **Test on real hardware.** Everything so far is the simulator and a browser. Worth doing before
   submitting, because nearly every bug found late in this work was a safe-area bug - the camera
   housing and the home indicator - and those are exactly what a simulator can get wrong. Play an
   encounter start to finish, and open a campaign that was started on an iPad.
-. **Update the App Store listing text**, which still describes an iPad and Mac app.
-. **Archive, upload, submit.**

Draft What's New:

> Skirmish now runs on iPhone. Every screen adapts to the size and shape of your device, held
> upright or sideways, and panels slide over the map when there isn't room beside it.

## Known issues, none blocking

- **Dynamic Type** is unsupported: every size in the app is in `px`. Sized up in `responsive.md`;
  roughly a day of work plus testing, and the one real unknown is whether a WKWebView here honours
  `font: -apple-system-body` as the scale source.
