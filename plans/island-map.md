# Island Map

The campaign map is the screen players see between every fight, and it currently asks them very
little. It is 1,000 hexes split into about 51 coloured regions. The only decision is which
neighbour to take next, with the Shipyard and buying a region as side routes. Nothing on the map
changes unless the player acts.

The region model already holds more than the map shows:

- `demographics.terrain` drives `EncounterMapGenerator.drawMapType` and the island thoughts, but it
  is never drawn. A player can't see that a region is mountainous without opening its card.
- `CampaignMapLogic.getMonsters` picks species at random, seeded on the region ID, so a marsh is as
  likely to hold frost giants as a taiga is.
- Conquered land turns plain white. The visible reward for winning is that the map gets emptier.

This plan gives the island real geography (mountains, lakes, rivers, towns and roads) and makes
that geography matter to play. It is about three things: **readable land**, **reasons to prefer one
region over another**, and **a map that changes over time**.

It starts by rebuilding the generator, because every feature here depends on the island having a
height and a climate, and today's generator has neither.


## Summary

| #  | Work                              | Effort | Benefit    | Depends on |
|----|-----------------------------------|--------|------------|------------|
| 0  | New island generator              | L      | —          | —          |
| 1  | Monsters by terrain               | S–M    | Medium     | —          |
| 2  | Drawn land                        | M      | High       | 0          |
| 3  | Peaks, lakes and water travel     | M      | High       | 0          |
| 4  | Towns                             | M      | High       | 0, 2       |
| 5  | Roads                             | M      | High       | 3, 4       |
| 6  | Landmarks                         | M      | High       | 0, 2       |
| 7  | Charting                          | S–M    | Medium     | 2          |
| 8  | Seasons and weather               | M      | High       | 0          |
| 9  | Territory perks                   | M      | Medium     | 0          |
| 10 | Warlords                          | M–L    | Medium     | 6          |
| 11 | Roaming threats and pushback      | L      | Uncertain  | 8, 10      |
| —  | Polish (ongoing)                  | S each | Low–Medium | 2          |

- **Phase 0** is invisible on its own, but it is the foundation for everything. Its output should
  be reviewed by eye with the developer **Regenerate Map** button before anything is built on it.
- **Phase 1** depends on nothing and can run alongside Phase 0.
- **Phases 2–5** are the core release: the island looks like a place, and its geography shapes
  where you can go.
- **Phases 6–9** each add something to play; ship them one at a time so balance is easy to judge.
- **Phases 10–11** should be prototyped behind an option.


## Phase 0 — New island generator

### Why rebuild it

[campaign-map-generator.ts](../src/generators/campaign-map/campaign-map-generator.ts) works in three
blind steps:

1. **Shape:** start with one hex and keep adding a random neighbour until there are 1,000. That
   makes a roundish blob with a fuzzy edge: no bays, peninsulas or offshore islands.
2. **Regions:** about 51 seed hexes take turns claiming neighbours. Borders follow nothing on the
   land.
3. **Terrain:** a dice roll per region, after everything else is done. Desert can sit beside Taiga,
   and Volcanic beside Fens.

Mountains, lakes, rivers, towns and roads all depend on knowing how high and how wet each part of
the island is. Added on top of today's output, they would look random: mountains ignoring region
borders, rivers that start nowhere.

The aim is an island that **looks plausible at a glance**, not a simulation. Each rule below earns
its place by making the map easier to read or giving players something to plan around. Climate
modelling, erosion and tectonics would cost a lot and players wouldn't notice them.

### What stays the same

- The hex grid and its coordinate scheme (offset columns, as in `getAdjacentSquares`).
- About 1,000 land hexes and about 51 regions, which keeps save size and campaign length where they
  are.
- The `squares` + `regions` model, with a few new fields.
- The whole `CampaignMapLogic` API. Conquest, buying, the Shipyard and the region card keep working.

### The pipeline

Each step reads the one before. Use the passed `rng` throughout. Today names and boons use
`Math.random`, so a seed doesn't reproduce a map; fixing that makes maps reproducible for tests and
bug reports.

**1. Shape.** Sample seeded fractal noise over a grid of about 2,000 candidate hexes, minus a
fall-off towards the edges, and keep the top ~1,000 as land. Sample at each hex's drawn centre
(`x + 0.5`, `y + 0.5 ± 0.25` by column parity, as `CampaignMapPanel.getHex` draws it) so the noise
lines up with what the player sees. Keep the largest connected landmass and drop any other
fragments. (Offshore islets are deferred; see [Islets](#islets-deferred) below.)

**2. Height.** The same noise, plus distance from the sea, gives a height of 0–9 per hex.

**3. Peaks.** The highest hexes (about 6% of land) become impassable peaks. They naturally form
ranges along ridges. Where a range is long, lower its single lowest hex back to passable land to make
a **pass**.

**4. Lakes.** Low basins away from the coast (about 3% of land) fill with water, and so does any
inland hole the shape step leaves.

**5. Rivers.** Start three to five rivers at seeded hexes beside peaks. Walk each downhill to a lake,
the sea or another river; if a river gets stuck in a dip, that dip becomes a small lake. River hexes
are ordinary passable land with a river on them.

**6. Moisture.** Hexes are wet near the sea, lakes and rivers. Pick a prevailing wind from the seed;
hexes downwind of a range are dry (a rain shadow). This is the one bit of real geography that pays
off most: deserts and steppe naturally form behind mountains.

**7. Hex terrain.** Choose each hex's terrain from height, moisture and a slight north–south
temperature shift, covering all twenty existing terrains:

| Height | Dry                          | Moderate            | Wet                                    |
|--------|------------------------------|---------------------|----------------------------------------|
| High   | Plateaus, Canyons            | Mountains           | Taiga                                  |
| Middle | Badlands, Scrubland, Steppe  | Valleys, Plains     | Forest                                 |
| Low    | Desert, Salt flats           | Plains, Riverlands  | Fens, Marshland, Wetlands, Lakes; Jungle and Rainforest in the warm south |

Volcanic is a rare hotspot on high ground. Lakes as a *terrain* means lake country: the land around
lake hexes, not the water itself. Riverlands is low land beside a river.

**8. Regions.** Grow regions from seeds as now, but each region claims its *cheapest* frontier hex
rather than a random one. A hex costs more if it is uphill, across a river, or a different terrain
from the region's seed. Peaks and lakes can't be claimed. Borders then follow ridges, rivers and
changes in terrain.

Each region's terrain is the **most common terrain among its hexes**, not a roll. The encounter maps
and island thoughts that already read `demographics.terrain` become accurate for free.

Count regions as now (`1 + claimable / 20`), but count only claimable hexes.

**9. Checks.** Each of these is fixed in the generator, not left to chance:

- **Reachability:** every region can be reached from every other by land. If the peaks cut the
  island apart, open another pass on the border between the parts.
- **Region size:** between 8 and 40 hexes. Merge a region that's too small into the neighbour it
  shares the longest border with; if a region is too large, reseed and regrow (rarely needed).
- **Start:** the starting region is on the sea coast, not only on a lake.

### Model changes

`CampaignMapSquareModel` gains:

```ts
terrain: string;            // set by the generator; never cleared, so it survives conquest
height: number;             // 0–9, for shading
feature?: 'peak' | 'lake';  // impassable; omitted on ordinary land
river?: boolean;            // omitted when false
```

`CampaignMapModel` gains:

```ts
seed: string;               // seeds decoration (glyph placement, landmark art)
```

Today `conquerRegion` clears each square's region and deletes the region, so nothing remembers what
conquered land was like. Keeping terrain on the square fixes that, and it's what Phases 2, 4 and 9
need.

`CampaignMapModel` also gains a record of conquests, used by towns, the route trail and the campaign
log:

```ts
history: { regionID: string, name: string, x: number, y: number }[];   // in order taken
```

Append to it in `CampaignMapLogic.conquerRegion`, which both conquest and buying go through.

**Save size.** Terrain and height add about 30 kB to a 1,000-hex map. An endgame save is about
280 kB against a 1 MB iCloud ceiling, so this fits. If it ever matters, store terrain as an index
into the list instead of a name.

### Ownership checks

Today a square with an empty `regionID` means "yours". Peaks and lakes have no region either, so add
one helper and route every check through it:

```ts
static isOwned = (square: CampaignMapSquareModel) => (square.regionID === '') && !square.feature;
```

These call sites need it:

- `CampaignMapLogic.isAdjacentToTerritory`, `hasCoastalTerritory` and `isConquered`. If
  `isConquered` is missed, the island can never be finished.
- `campaign-map-page.tsx:170` (owned squares).
- `main.tsx:509` (percentage controlled, for Game Center progress) and `thought-logic.ts:67`. These
  should also divide by claimable squares, not all squares.
- `CampaignMapPanel.getHex`, which currently draws any square without a region as yours.

### Existing saves

Patch in `Platform.updateGame`: give the map a seed and an empty history. Copy each unconquered
square's terrain from its region; give each conquered square the terrain of the nearest square that
still has one, and height 0. With no features and no rivers, the old map behaves exactly as it does
today. The new generator applies to new campaigns and to **Regenerate Map**.

### Performance

The generator looks up neighbours with `squares.find`, which scans every square. That's fine for
today's single pass but not for nine passes with path costs. Index squares by `"x,y"` using the
existing `hash-table` util. The landing screen calls the generator on every visit, so aim for well
under 100 ms on a phone.

### Side effects

The landing screen draws its picture from `generateCampaignMap([], Random.getSeededRNG('landing'))`,
so the picture will change. Check it still looks good.

### Tests

Generator output is random, so test properties over a few hundred seeds rather than exact maps:

- The land count is in range, there is a single landmass, and every region is reachable from the
  start by land.
- Every region is 8–40 hexes, and the start is on the sea coast.
- No peak or lake belongs to a region, and every claimable hex does.
- Every river ends at a lake, the sea or another river.
- All three terrain height bands appear.
- The same seed produces the same map.

Extend `campaign-map-logic.test.ts` with `isOwned`, `isConquered` on a map with peaks, and terrain
surviving `conquerRegion`.

### Islets (deferred)

Small offshore islands (up to three, 5–20 hexes, one region each) would give the Shipyard a
guaranteed use and make good warlord seats. They are left out of the first version because an islet
can only be reached by water, by attack or purchase, and the Shipyard is a region reward, not a
starting structure. A campaign that never gets a Shipyard could never take an islet, and so could
never finish the island.

To add them later, the generator keeps up to three fragments from the shape step instead of
dropping them, seeds one region on each, and exempts them from the land-reachability check. That
needs one of these alongside:

- **A guaranteed Shipyard:** one early region near the start always has a Shipyard as its boon.
- **Islets don't count:** `isConquered` ignores islet regions, so they are optional rewards.

The property tests then check that a Shipyard can always be had, or that the island can be finished
without the islets.


## Phase 1 — Monsters by terrain

**Independent of everything else; start it any time.**

`SpeciesModel` has no habitat. Add a lookup in data rather than a model field, in the style of
`EncounterMapGenerator.terrainWeights`:

```ts
static habitats: { terrains: string[], speciesIDs: string[] }[]
```

`getMonsters` keeps its seeded RNG but draws mostly (say three in four) from species that suit the
region's terrain, falling back to the full deck. Species not in any list can appear anywhere, so
packs without habitat data still work.

Optionally, let a region share one species with a neighbour, so players recognise a "front" as they
push into an area.

- **Benefit:** the island makes sense, and players can predict threats and build a party for them.
  The region card already lists monsters, so this needs no UI work.
- **Effort:** mostly content. Classifying every species across all packs is the slow part.
- **Docs:** one line in `assets/docs/island.md`.


## Phase 2 — Drawn land

**The biggest visual payoff. Depends on Phase 0.**

Split `CampaignMapPanel.render` into layered `<g>` groups (sea, land, rivers, features, settlements,
labels) so later phases add a layer instead of growing `getHex`.

- **Sea:** fill the background with water, with a lighter band of shallows along the coast.
- **Land:** shade each hex lightly by height. Draw terrain glyphs (trees, dunes, reeds) on a seeded
  subset of hexes so the land reads as texture, not wallpaper. Keep the region colour as a tint;
  it's still what tells regions apart.
- **Peaks:** a mountain symbol on every peak hex, with no tint, so ranges read clearly as walls.
  Passes should be obvious.
- **Lakes:** drawn as water, like the sea.
- **Rivers:** a line through hex centres, thickening downstream.
- **Your territory:** drawn in its terrain at reduced saturation, not plain white. Its border should
  still stand out clearly (which is why the generator caps region lightness at 229).
- **Zoom:** draw glyphs only above a zoom threshold, or faintly below it. The panel already tracks
  zoom through `viewBox`.

Use `<use href>` against one `<defs>` symbol per glyph so a thousand glyphs stay cheap. Check both UI
themes and the `mode: 'region'` view on the region card.

- **Benefit:** route planning at a glance, and the island finally looks like a place.
- **Effort:** mostly art and SVG.


## Phase 3 — Peaks, lakes and water travel

**Depends on Phase 0.** This is where geography starts to shape where you can go.

### Peaks

Peaks belong to no region, so you can't attack, buy or own them. Adjacency already ignores them
through `isOwned`: two regions with only peaks between them aren't neighbours. Ranges turn the
island into valleys and peninsulas, and the region holding a pass becomes worth fighting for.

### Water bodies

Today the Shipyard rule is: your territory and the target both touch the sea. With lakes and rivers,
replace it with: **your territory and the target share a body of water.**

A body of water is a connected set of sea, lake and river hexes. A river belongs to the body it flows
into. So:

- A river that reaches the sea makes every region along it reachable from any coast, which is the
  upriver voyage.
- A lake is its own small sea: any region on its shore can sail to any other region on it.
- A river that ends in a lake joins that lake.

Add `CampaignMapLogic.getWaterBodies(map, region)`, worked out from the map and cached (the squares
never change), and use it in `canReachRegionBySea`. `isCoastal` keeps its meaning for the region card
(touches the sea), but must count a lake hex as water: today it checks for fewer than six neighbours,
and lake hexes are on the map.

The cost doesn't change: one Shipyard charge per voyage, for buying as well as attacking.

### Encounters

Fights in a region with a river hex get water squares on the encounter map. Water already exists as
difficult terrain, and Aquatic creatures benefit from it, so this is a small addition to
`generateEncounterMap`.

### UI and docs

The region card's **Coastline** stat becomes **Waterways**: sea, lake or river names. Rewrite the
sea-voyage paragraph in `assets/docs/island.md` around shared water.

- **Benefit:** chokepoints from peaks, shortcuts from water, and an interior the Shipyard can
  finally reach.
- **Risk:** river travel speeds up expansion. Record a full campaign's length before and after.


## Phase 4 — Towns

**Depends on Phases 0 and 2.**

### Generation

Add a step to the generator after regions: place settlements by population. Population works as now
(a roll scaled by region size), but is then shown as settlements: a region with population 7 might
have a town of 4 and a hamlet of 3. Settlements prefer river, lake and coast hexes, and never sit on
peaks or lakes.

Store them on the map, not the region, since regions are deleted on conquest:

```ts
settlements: { name: string, x: number, y: number, size: number, takenAt?: number }[];
```

Name towns with `NameGenerator`. `takenAt` is the conquest number when the region was taken, from
`history.length`.

`demographics.population` stays the source of truth, so purchase price and conquest income don't
change.

### Effects

- **Visible value:** a town makes a region visibly worth more, and the game already pays this
  through population. The player can see why a region pays more before opening its card.
- **Taking the town:** in a region with a town, the last encounter is fought in the town. Add an
  optional forced map type to `generateEncounterMap`, and pick between `generateStreetMap` and
  `generateBuildingMap`.
- **After conquest:** settlements stay on the map and grow a size step every few conquests after
  `takenAt`. Your land fills up instead of going blank.
- **Thoughts:** island thoughts can name towns ("I've heard the market in {town} never closes.").

### UI

Draw town and hamlet glyphs in the settlements layer, sized by `size`. The region card lists its
settlements.

- **Benefit:** population becomes visible and meaningful, and conquered land feels like progress.


## Phase 5 — Roads

**Depends on Phases 3 and 4.**

### Generation

After towns, join them with roads:

1. Find paths between towns over passable hexes. The cost is higher uphill and across rivers (a
   bridge), and lower along existing roads, so roads merge into a network rather than running side
   by side.
2. Build a minimum spanning tree over the towns, weighted by path cost, then add a few extra short
   edges so there are some loops.
3. Roads use passes where they must cross a range, which is what makes passes matter.

Store roads as paths, since the regions they cross are deleted later:

```ts
roads: { x: number, y: number }[][];
```

That's a few hundred coordinates, a few kB.

### Road march

A region is attackable if a road leads to it from your territory **through exactly one other
region**. Follow the road from an owned hex: the first region it enters is already adjacent; the
second is now reachable too. Add this as a third case in `CampaignMapLogic.canAttackRegion`, beside
adjacency and water, and use it for buying.

Towns then become springboards, and a road leading into enemy land is a corridor worth pushing
along.

### UI

Draw roads under settlements, with bridge marks where they cross rivers. On the region card, say how
it can be reached: **Border**, **Road** or **By water**.

- **Benefit:** "pick a neighbour" becomes route planning.
- **Trade (deferred):** income for roads joining your towns. Add it only if the money economy needs
  it once road march is in.
- **Tests:** reachability gets a new case; cover it in `campaign-map-logic.test.ts`.


## Phase 6 — Landmarks

**Depends on Phases 0 and 2.**

`RegionModel` gains:

```ts
landmark: { type: LandmarkType, x: number, y: number } | null;
```

Put one in about one region in five, on a hex that suits it (a shipwreck on the coast, standing
stones on high ground). Draw each as its own icon and show it on the region card.

| Landmark        | Effect when the region is taken                                  |
|-----------------|------------------------------------------------------------------|
| Ruined tower    | A magic item, in addition to the region's boon                   |
| Shrine          | Every hero gains XP                                              |
| Shipwreck       | Money and a free Shipyard charge                                 |
| Standing stones | One extra charge on a random structure                           |
| Lair            | The last encounter is a boss; better boon                        |
| Dungeon         | The encounter map is forced to `dungeon` or `warren`             |

Grant the landmark in `CampaignLogic.conquerRegion` and `purchaseRegion`, next to
`game.boons.push(region.boon)`.

**Rumours:** island thoughts can name a landmark's region ("They say there's something old in the
stones at {region}.").

**Victory conditions:** the conditions in `ideas.md` (hold an area; kill a target in N rounds) could
become landmark types later. Keep them out of the first version.

- **Benefit:** a goal beyond "the next region", and places on the island worth remembering.


## Phase 7 — Charting

**Depends on Phase 2.**

The baseline is worked out from the map, so it costs nothing to store:

- **Charted:** your territory and every region you can reach. Shown in full.
- **Sighted:** regions on a body of water you share. Terrain, settlements and landmark icon shown;
  monsters and boon unknown.
- **Uncharted:** everything else. Drawn as parchment with faint terrain, and the region card shows
  only its name.

The Intelligencer (or a future Cartographer, from the structure wishlist in `ideas.md`) can spend a
charge to chart one region outright. That needs a stored `map.charted: string[]` of region IDs.

The price of a reachable region must always show, so a player is never blocked from buying or
sailing for lack of information.

- **Benefit:** every conquest reveals something, and voyages feel like expeditions.
- **Risk:** hiding information players use today. Playtest whether hiding monsters on sighted
  regions annoys more than it intrigues.


## Phase 8 — Seasons and weather

**Depends on Phase 0.**

A season passes every *N* regions taken. The count is `history.length`, so it needs no new state.
Start with N = 4, so a campaign sees about three years.

**Seasons** change two things:

1. **Looks:** a palette shift, snow on Taiga, Mountains and peaks in winter, swollen rivers in
   spring.
2. **Encounters:** pass the season into `generateEncounterMap` alongside terrain. In winter, some
   water squares become ordinary ground (ice). In spring, wetland and river maps get more water.

**Storms** are seeded from the map seed and the season, and cover a stretch of sea coast for one
season. A voyage that starts or ends inside one costs two Shipyard charges. When the Codex Arcanum
pack is on, the Observatory can show next season's storms.

**Fog** over one region per season hides its monsters until it's next to your territory. It combines
with Phase 7 if that has shipped.

- **Benefit:** the first sense of time passing, more variety from repeated terrain, and a reason to
  hurry or wait.
- **Docs:** a new section in `assets/docs/island.md`.


## Phase 9 — Territory perks

**Depends on Phase 0 (terrain kept on squares).**

Holding enough of a terrain gives a stronghold bonus. For example: Mountains make the Forge cheaper,
Forest lowers Warehouse costs, river and lake country makes Shipyard charges cheaper, and Plains add
income.

Count hexes, not regions, so a large region matters more. Show the active perks on the stronghold
page.

- **Benefit:** where you expand starts to matter for what you build.
- **Effort:** mostly balance work.


## Phase 10 — Warlords

**Depends on Phase 6 (a warlord's seat is a Lair landmark).**

Three or four regions are warlord seats, each with a named boss. A warlord controls the regions
within a few hexes, shown by a banner or tinted border. Defeating a warlord removes one encounter
from each of their regions and lowers their purchase price.

Place seats in defensible spots, such as behind a pass or across a lake, so the geography sets them
up. If islets are added later, they make good seats too.

- **Benefit:** the island gets a structure of objectives (a mid-game arc), not 50 regions of equal
  weight.


## Phase 11 — Roaming threats and pushback

**Prototype behind an option. Depends on Phases 8 and 10.**

- **Roaming band:** a marker that moves a hex or two each season, following roads where it can. Its
  region gets one extra, harder encounter and a better boon. Chasing it is optional.
- **Pushback:** each season, a warlord may retake one thinly held border region of yours. A Barracks
  or War Room charge prevents it.

`OptionsModel` has no difficulty setting yet; add one here rather than tying pushback to a pack.
Pushback changes the feel of the game more than anything else in this plan. Losing ground feels
bad, so it must be rare, warned about in advance, and preventable.


## Polish (any time after Phase 2)

Small, independent items to pick up between phases:

- **Party banner and route trail:** a banner on the last region taken, with a dotted trail through
  earlier conquests, from `history`.
- **Animated sea:** waves, a passing ship, gulls. Respect `options.reduceMotion`. Verify through
  the Web Animations API, since the browser pane runs hidden.
- **Names on the map:** region, town, lake and river names above a zoom threshold.
- **Frame:** a parchment border and compass rose.
- **Campaign log:** "Took Valdmoor, spring of year 2", from `history` and the season count.


## Open decisions

1. **Islets:** deferred. If they come back, should they come with a guaranteed Shipyard, or be
   optional and left out of `isConquered`? (Phase 0.)
2. **Town recruits:** should a town region offer more recruit candidates, or is a guaranteed town
   fight enough? (Phase 4.)
3. **Road effect:** road march only, or road march plus trade? (Phase 5.)
4. **Landmarks and buying:** does buying a region grant its landmark? I'd say no for Lair and
   Dungeon, since those are about the fight. (Phase 6.)
5. **Charting:** how much of a sighted region does the player see? (Phase 7.)
6. **Season length:** four regions per season is a guess; tie it to measured campaign length.
   (Phase 8.)
7. **Pushback:** in the game at all, or only at a higher difficulty? (Phase 11.)
