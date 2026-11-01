# Hero portraits

A picture of a hero wearing and holding what they actually have equipped, generated from the hero
itself. Not started; this is the spec.

## What it is for

Heroes are currently a name, three tags and a coloured monogram token. The player spends a lot of
effort kitting heroes out, and none of it is visible. A portrait makes a hero recognisable at a
glance and makes a new magic item feel like it changed something.

## Decisions

- **Procedural, layered SVG drawn in code.** It is drawn the same way as `CampaignMapPanel` and
  `StrongholdMapPanel`: plain SVG elements inside React, with no new dependency.
- **Derived, never stored.** The portrait is worked out from the hero every time it is drawn.
  Nothing is added to `CombatantModel` and nothing is added to the save. That matters because an
  endgame save is already about 280kB, against the 1MB iCloud limit.
- **Deterministic.** The hero's `id` seeds `Random.getSeededRNG`, so a hero looks the same on every
  device and every visit. It only changes when their equipment changes.
- **Full figure.** The portrait shows the whole hero so equipment such as footwear is visible.
- **Works offline and costs nothing per image.** That rules out AI image generation. It needs a
  network connection, has a per-image cost and can't be relied on to show the exact kit, and its
  output would have to be cached somewhere, which brings back the save-size problem.
- **The data is kept separate from the drawing.** A pure logic function decides *what* to draw.
  A panel decides *how* to draw it. Better art can then replace a shape without touching the rules,
  and the rules can be unit tested without rendering anything.

## Inputs

Everything comes from the `CombatantModel`:

| Field | Used for |
|---|---|
| `id` | the seed for every random choice |
| `speciesID` | body template and species features (via `GameLogic.getSpecies`) |
| `size`, `quirks` | overall scale; `Small` gives shorter proportions |
| `color` | main clothing colour; trim and shading come from `Color.tweak` |
| `items` | what is drawn - equipped items only |

`carried` items are not drawn: they are in a pack, not worn. Role and background are not used in
the first version (see "Later").

Only hero species are in scope: the 17 cards with `type: CombatantType.Hero` across the packs.
Monsters already have tokens, and many of them are beasts, swarms or oozes that cannot hold items.

## The model

In `src/models/portrait.ts`:

```ts
export interface PortraitModel {
	body: PortraitBody;
	layers: PortraitLayer[];   // already in drawing order, back to front
}

export interface PortraitBody {
	template: string;          // e.g. 'biped', 'short', 'small', 'large'
	features: string[];        // species extras, e.g. 'horns', 'tail', 'wings', 'pointed-ears'
	skin: string;
	hair: string;
	hairStyle: string;
	cloth: string;
	trim: string;
}

export interface PortraitLayer {
	slot: PortraitSlot;
	shape: string;             // e.g. 'sword', 'longbow', 'tower-shield', 'plate'
	color: string;
	magic: string | null;      // glow colour for a magic item, otherwise null
	itemID: string;
}

export enum PortraitSlot {
	Back = 'back',             // cloaks, quivers, a two-handed weapon when another is in hand
	Body = 'body',
	Waist = 'waist',           // belts, sashes, bandoliers
	Feet = 'feet',
	Neck = 'neck',
	Head = 'head',
	Ring = 'ring',
	MainHand = 'main-hand',
	OffHand = 'off-hand',
	TwoHands = 'two-hands'
}
```

`PortraitSlot` goes in `src/enums/portrait-slot.ts`, following the other enums.

## The logic

`src/logic/portrait/portrait-logic.ts`, with `PortraitLogic.getPortrait(hero: CombatantModel): PortraitModel`.

### Which shape an item gets

Use the mundane item's name: `item.magic ? item.baseItem : item.name`. Magic items are renamed by
`NameGenerator`, but `baseItem` keeps the original name ("Sword", "Tower Shield").

Look up that name in a shape table, `PORTRAIT_SHAPES: Record<string, string>`. If it isn't there,
fall back on the item's location and proficiency:

| Location | Proficiency | Fallback shape |
|---|---|---|
| Hand | MilitaryWeapons | `sword` |
| Hand | LargeWeapons | `greatsword` |
| Hand | PairedWeapons | `daggers` |
| Hand | RangedWeapons | `bow` (2 slots) or `hand-crossbow` (1 slot) |
| Hand | PowderWeapons | `pistol` (1 slot) or `musket` (2 slots) |
| Hand | Implements | `wand` |
| Hand | Shields | `shield` |
| Body | LightArmor | `leather` |
| Body | HeavyArmor | `chain` |
| Body | None | `belt` (drawn at the waist) |
| Head | any | `circlet` |
| Neck | any | `pendant` |
| Feet | any | `boots` |
| Ring | any | `ring` |

Map **location first, then proficiency**. Proficiency alone isn't enough: the Amulet has the
`Implements` proficiency but sits at the `Neck`.

Many shapes can share one drawing with different parameters, at least at first. Sword, Katana,
Scimitar and Rapier can all be one blade function with different length and curve. The shape table
can map straight to that, e.g. `'Scimitar': 'blade:curved'`.

### Where it goes

Equipment rules (`CombatantLogic.canEquip`) allow two Hand slots and two Ring slots, and one slot at
every other location. That limits the cases:

- **One 2-slot Hand item**: Paired weapons are split across `MainHand` and `OffHand`. Every other
  2-slot item goes in `TwoHands`.
- **Two 1-slot Hand items**: a shield always goes in `OffHand`. Otherwise the order is weapon, then
  implement, then anything else, and the first one goes in `MainHand`.
- **One 1-slot Hand item**: it goes in `MainHand`, unless it's a shield, which goes in `OffHand`.
- **Body**: armour proficiencies go in `Body`. Bandolier, Belt and Sash (proficiency `None`) go in
  `Waist`. A hero can wear only one Body item, so the two never clash.
- **Neck**: a Cloak goes in `Back`. Everything else goes in `Neck`.
- **Ring**: at most two, drawn on the visible hand(s). Armbands, bracers and bracelets are drawn on
  the forearm, not as a ring glint.

The layers are drawn in this order, back to front: `Back`, body, `Feet`, `Body`, `Waist`, `Neck`,
head and hair, `Head`, `OffHand`, `TwoHands`, `MainHand`, `Ring`.

### Colour

- Armour, weapons and shields take a material colour from the shape: steel, iron, wood, leather or
  bone. It is lightly varied with `Color.tweak` using the seeded RNG, so two swords aren't
  identical.
- Cloth items (Cloak, Hood, Sash, Scarf) use the hero's `trim` colour.
- A **magic** item gets a glow. Its colour comes from the first `weapon.damage` type, if it has one,
  from a small table (Fire → orange, Cold → pale blue, Electricity → yellow, Decay → green, Light →
  white, Psychic → violet, and so on). Otherwise it uses a neutral arcane blue.

### Body

Each hero species maps to a **template** and a list of **features** in a table,
`PORTRAIT_SPECIES: Record<string, { template: string, features: string[] }>`, keyed by species ID.

| Template | Proportions |
|---|---|
| `biped` | the default |
| `short` | stocky, about 80% height |
| `small` | about 60% height, larger head - also used for any species with the `Small` quirk |
| `large` | broad, about 115% height; used for the Minotaur |

Features are small additions drawn on top of the body: `pointed-ears`, `horns`, `tail`, `wings`,
`snout`, `muzzle`, `fins`, `hooves`, `frost`, `glow-eyes`, `seams`. The full species-to-feature
table is the first task of phase 2, written against each species card's description. Until then,
any species not in the table is drawn as a plain `biped`.

`skin`, `hair` and `hairStyle` are seeded picks from a short list per template. `cloth` is
`hero.color` and `trim` is a tweak of it.

### Seeding

Make a single RNG from `hero.id` and use it in a **fixed order**: body choices first, then each item
in `items` order. Ideally an item's variation should be seeded from `hero.id + item.id`, so that
adding or removing one item doesn't change how everything else looks.

## The panel

`src/components/panels/hero-portrait/hero-portrait-panel.tsx` (plus `.scss`), exported from
`src/components/panels/index.ts`.

```ts
interface Props {
	hero: CombatantModel;
	size?: 'small' | 'large';   // small hides fine detail such as rings
}
```

- Draws one `<svg viewBox='0 0 100 140'>`, calls `PortraitLogic.getPortrait`, and maps each layer
  to a drawing function keyed by its `shape`. Shapes without a drawing function are skipped and
  logged once in development.
- The drawing functions go in `hero-portrait-shapes.tsx` next to the panel. Each one returns a
  `<g>` placed in the slot's coordinate frame, so a sword is drawn once and works in either hand
  (the off hand is mirrored).
- The magic glow is a single shared `<filter>` in `<defs>`, applied through each layer's `filter`
  attribute with that layer's glow colour.
- Stroke and outline colours come from the app's existing CSS custom properties, so the portrait
  follows the light and dark themes.
- Do not memoise `PortraitLogic.getPortrait`; recompute it on render.
- `ScaleToFit` handles sizing wherever the container's size isn't fixed.

## Where it appears

1. **Character sheet modal**: in the header, beside the name and tags. This is the main place to
   see it.
2. **Hero builder, finish page**: shows the new hero with their starting kit.
3. **Equipment page of the hero builder, and the character sheet's Items tab**: updates straight
   away as items are equipped and unequipped. This comes for free because the portrait is derived
   from the hero.
4. **`HeroCard`**: a small portrait in place of, or beside, the current artwork. Do this last; the
   card is small and appears in many places, so check it at phone width first.

The encounter map tokens are not changed. At map scale a portrait would be unreadable, and the
monogram tokens work.

## Testing

`src/logic/portrait/portrait-logic.test.ts`, with Vitest as for the other logic:

- **Every item resolves.** For every item in every pack, the shape lookup returns a shape that has
  a drawing function. This is what catches a new item added to a pack without a picture. Keep the
  list of shape names in a constant the test can import, rather than importing the panel.
- **Slot rules**: a shield always ends up in `OffHand`. Paired weapons fill both hands. A 2-slot
  item never shares the hands with anything else. A Cloak goes in `Back`.
- **Deterministic**: the same hero gives the same portrait every time. Two heroes with identical
  kit but different `id`s give different `skin`/`hair`.
- **Stable**: adding a ring doesn't change any other layer's colour.
- **Every hero species has a template**: every species with `type: CombatantType.Hero` is in
  `PORTRAIT_SPECIES` (phase 2 onward).

To check it visually, open the panel in the browser pane with `HeroGenerator.generateHero` heroes,
the way `landing-illustrations.tsx` builds its fixed-seed examples. Check light and dark themes, and
phone width.

## Phases

1. **The whole path, with simple shapes.** The model, the logic with the full slot rules and the
   proficiency fallback, one `biped` body, and one simple drawing per fallback shape (14 shapes).
   The glow, the panel on the character sheet, and all the tests except the species one. The
   result: every hero has a portrait that shows the right *kinds* of kit.
2. **Bodies.** The species table, the four templates and the features, plus seeded hair and skin.
3. **Specific items.** Fill in `PORTRAIT_SHAPES` for the named base items in core (about 60), then
   codex-arcanum (26), skullduggery, workshop and the single items in the other packs. Group them
   into shared parameterised drawings where possible.
4. **Everywhere else.** The hero-builder pages and `HeroCard`.

Phase 1 is a self-contained piece of work. The rest is mostly art, and can be done gradually.

## Later, not in scope

- Role-based pose or clothing cut (a robe for casters, a tabard for warriors).
- Showing damage taken: a wounded or dying look in the encounter screen.
- Exporting the portrait as an image to share.
- Monster portraits.

## Open questions

- **Does it replace the monogram anywhere?** Initiative lists and the hero strip could use a cropped
  head. Probably not worth it until the art is good.
