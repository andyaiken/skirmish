# Island Map

The campaign map is the screen players see between every fight. It now has generated terrain,
height, peaks and terrain-based monster selection, with a starting region and conquest history. The
remaining work is to make that geography more visible and give it more effect on routes, settlements
and the campaign over time. Conquered land still turns plain white, and the Shipyard only reaches
regions on the coast.


## Summary

| #  | Work                              | Effort | Benefit    | Depends on |
|----|-----------------------------------|--------|------------|------------|
| 2  | Drawn land                        | M      | High       | —          |
| 3  | Lakes and water travel            | M      | High       | —          |
| 4  | Towns                             | M      | High       | 2          |
| 5  | Roads                             | M      | High       | 3, 4       |
| 6  | Landmarks                         | M      | High       | 2          |
| 7  | Charting                          | S–M    | Medium     | 2          |
| 8  | Seasons and weather               | M      | High       | —          |
| 9  | Territory perks                   | M      | Medium     | —          |
| 10 | Warlords                          | M–L    | Medium     | 6          |
| 11 | Roaming threats and pushback      | L      | Uncertain  | 8, 10      |
| —  | Polish (ongoing)                  | S each | Low–Medium | 2          |

- Phase numbers are retained for existing cross-references; completed Phases 0 and 1 are omitted.
- **Phases 2–5** are the core release: the island looks like a place, and its geography shapes
  where you can go.
- **Phases 6–9** each add something to play; ship them one at a time so balance is easy to judge.
- **Phases 10–11** should be prototyped behind an option.


## Phase 2 — Drawn land

**The generator and basic map layers are in place.**

- **Land:** draw terrain glyphs (trees, dunes, reeds) on a seeded subset of hexes so the land reads
  as texture, not wallpaper. Keep the region colour as a tint; it's still what tells regions apart.
- **Rivers:** draw a line through hex centres, thickening downstream.
- **Zoom:** draw glyphs only above a zoom threshold, or faintly below it. The panel already tracks
  zoom through `viewBox`.

Use `<use href>` against one `<defs>` symbol per glyph so a thousand glyphs stay cheap. Check the
terrain glyphs in both UI themes and the `mode: 'region'` view on the region card.

- **Benefit:** route planning at a glance, and the island finally looks like a place.
- **Effort:** mostly art and SVG.


## Phase 3 — Lakes and water travel

The generator already adds impassable peaks and lakes. This phase makes lakes and rivers shape
where you can go.

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

### Islets (deferred)

Keep up to three small offshore islands, with one region each, as optional Shipyard destinations and
potential warlord seats. Since the Shipyard is a region reward, make sure islets cannot prevent
campaign completion: either guarantee an early Shipyard or exclude islet regions from `isConquered`.

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

**Depends on Phase 2.**

### Generation

Use each region's existing population to place settlements: a region with population 7 might have a
town of 4 and a hamlet of 3. Settlements prefer river, lake and coast hexes, and never sit on peaks
or lakes.

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
- **After conquest:** settlements grow a size step every few conquests after `takenAt`. Your land
  fills up instead of going blank.
- **Thoughts:** island thoughts can name towns ("I've heard the market in {town} never closes.").

### UI

Show town and hamlet glyphs sized by `size`. The region card lists its settlements.

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

**Depends on Phase 2.**

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
   optional and left out of `isConquered`? (Phase 3.)
2. **Town recruits:** should a town region offer more recruit candidates, or is a guaranteed town
   fight enough? (Phase 4.)
3. **Road effect:** road march only, or road march plus trade? (Phase 5.)
4. **Landmarks and buying:** does buying a region grant its landmark? I'd say no for Lair and
   Dungeon, since those are about the fight. (Phase 6.)
5. **Charting:** how much of a sighted region does the player see? (Phase 7.)
6. **Season length:** four regions per season is a guess; tie it to measured campaign length.
   (Phase 8.)
7. **Pushback:** in the game at all, or only at a higher difficulty? (Phase 11.)
