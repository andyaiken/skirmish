import { BackgroundList } from '../data/background-data';
import { ItemList } from '../data/item-data';
import { RoleList } from '../data/role-data';
import { HeroSpeciesList, MonsterSpeciesList } from '../data/species-data';
import { universalFeatures, universalActions } from '../data/universal-data';
import { ActionModel } from '../models/action';
import { AuraModel } from '../models/aura';
import { BoonModel } from '../models/boon';
import { CampaignMapRegionModel } from '../models/campaign-map';
import { CombatDataModel } from '../models/combat-data';
import { CombatantModel } from '../models/combatant';
import { EncounterModel } from '../models/encounter';
import { EncounterMapSquareModel } from '../models/encounter-map';
import {
	AuraType,
	BoonType,
	CombatDataState,
	CombatantType,
	TraitType,
	SkillType,
	SkillCategoryType,
	ItemProficiencyType,
	DamageType,
	DamageCategoryType,
	FeatureType,
	EncounterMapSquareType,
	ConditionType,
	EncounterState
} from '../models/enums';
import { FeatureModel } from '../models/feature';
import { GameModel } from '../models/game';
import { ItemModel } from '../models/item';
import { SpeciesModel } from '../models/species';
import { CampaignMapUtils } from './campaign-map-utils';
import { Collections } from './collections';
import { EncounterMapUtils } from './encounter-map-utils';
import { FeatureUtils } from './feature-utils';
import { MagicItemGenerator } from './magic-item-generator';
import { Random } from './random';
import { Utils } from './utils';

export const getRandomAction = () => {
	const actions: ActionModel[] = [];

	HeroSpeciesList.forEach(s => actions.push(...s.actions));
	MonsterSpeciesList.forEach(s => actions.push(...s.actions));
	RoleList.forEach(r => actions.push(...r.actions));
	BackgroundList.forEach(b => actions.push(...b.actions));

	const n = Random.randomNumber(actions.length);
	const copy = JSON.parse(JSON.stringify(actions[n])) as ActionModel;
	copy.id = Utils.guid();

	return copy;
};

export const createAura = (feature: FeatureModel) => {
	const aura: AuraModel = {
		id: Utils.guid(),
		type: feature.aura,
		damage: feature.damage,
		DamageCategoryType: feature.DamageCategoryType,
		rank: feature.rank
	};
	return aura;
};

export const getAuraDescription = (aura: AuraModel) => {
	switch (aura.type) {
		case AuraType.AutomaticHealing:
		case AuraType.EaseMovement:
		case AuraType.PreventMovement:
			return `${aura.type}`;
		case AuraType.AutomaticDamage:
			return `${aura.type}: ${aura.damage}`;
		case AuraType.DamageResistance:
		case AuraType.DamageVulnerability:
			return `${aura.type}: ${aura.DamageCategoryType}`;
	}

	return '';
};

export const generateBoon = (): BoonModel => {
	const list = [
		BoonType.ExtraHero,
		BoonType.ExtraXP,
		BoonType.LevelUp,
		BoonType.MagicItem
	];
	const type = Collections.draw(list);

	let data = null;
	switch (type) {
		case BoonType.MagicItem:
			data = MagicItemGenerator.generateMagicItem();
			break;
		case BoonType.ExtraXP:
			data = Random.dice(1);
			break;
	}

	return {
		id: Utils.guid(),
		type: type,
		data: data
	};
};

export const createCombatData = (combatant: CombatantModel): CombatDataModel => {
	return {
		id: combatant.id,
		type: combatant.type,
		size: combatant.size,
		state: CombatDataState.Standing,
		position: {
			x: 0,
			y: 0
		},
		damage: 0,
		wounds: 0,
		initiative: Number.MIN_VALUE,
		movement: 0,
		senses: 0,
		hidden: 0,
		conditions: [],
		actions: []
	};
};

export const createCombatant = (type: CombatantType): CombatantModel => {
	return {
		id: Utils.guid(),
		type: type,
		name: '',
		speciesID: '',
		roleID: '',
		backgroundID: '',
		size: 1,
		level: 1,
		xp: 0,
		features: [],
		items: []
	};
};

export const applyCombatantCards = (combatant: CombatantModel, speciesID: string, roleID: string, backgroundID: string) => {
	const species = getSpecies(speciesID);
	if (species) {
		combatant.speciesID = species.id;
		combatant.size = species.size;
		species.traits.forEach(t => combatant.features.push(FeatureUtils.createTraitFeature(t, 1)));
	}

	const role = getRole(roleID);
	if (role) {
		combatant.roleID = role.id;
		role.traits.forEach(t => combatant.features.push(FeatureUtils.createTraitFeature(t, 1)));
		role.skills.forEach(s => combatant.features.push(FeatureUtils.createSkillFeature(s, 2)));
		role.proficiencies.forEach(p => combatant.features.push(FeatureUtils.createProficiencyFeature(p)));
	}

	const background = getBackground(backgroundID);
	if (background) {
		combatant.backgroundID = background.id;
	}

	if (combatant.type === CombatantType.Monster) {
		combatant.name = `${species?.name ?? ''} ${role?.name ?? ''}`;
	}
};

export const incrementCombatantLevel = (combatant: CombatantModel) => {
	const deck = getFeatureDeck(combatant);
	const n = Random.randomNumber(deck.length);
	const feature = JSON.parse(JSON.stringify(deck[n])) as FeatureModel;

	combatant.features.push(feature);
	combatant.level += 1;
};

export const makeFeatureChoices = (combatant: CombatantModel) => {
	combatant.features.forEach(feature => {
		if (feature.trait === TraitType.Any) {
			const options = [
				TraitType.Endurance,
				TraitType.Resolve,
				TraitType.Speed
			];
			feature.trait = Collections.draw(options);
		}

		if (feature.skill === SkillType.Any) {
			const options = [
				SkillType.Brawl,
				SkillType.Perception,
				SkillType.Reactions,
				SkillType.Spellcasting,
				SkillType.Stealth,
				SkillType.Weapon
			];
			feature.skill = Collections.draw(options);
		}

		if (feature.skillCategory === SkillCategoryType.Any) {
			const options = [
				SkillCategoryType.Physical,
				SkillCategoryType.Mental
			];
			feature.skillCategory = Collections.draw(options);
		}

		if (feature.proficiency === ItemProficiencyType.Any) {
			const options = [
				ItemProficiencyType.MilitaryWeapons,
				ItemProficiencyType.LargeWeapons,
				ItemProficiencyType.PairedWeapons,
				ItemProficiencyType.RangedWeapons,
				ItemProficiencyType.PowderWeapons,
				ItemProficiencyType.Implements,
				ItemProficiencyType.LightArmor,
				ItemProficiencyType.HeavyArmor,
				ItemProficiencyType.Shields
			];
			feature.proficiency = Collections.draw(options);
		}

		if (feature.damage === DamageType.Any) {
			const options = [
				DamageType.Acid,
				DamageType.Cold,
				DamageType.Decay,
				DamageType.Edged,
				DamageType.Electricity,
				DamageType.Fire,
				DamageType.Impact,
				DamageType.Light,
				DamageType.Piercing,
				DamageType.Poison,
				DamageType.Psychic,
				DamageType.Sonic
			];
			feature.damage = Collections.draw(options);
		}

		if (feature.DamageCategoryType === DamageCategoryType.Any) {
			const options = [
				DamageCategoryType.Physical,
				DamageCategoryType.Energy,
				DamageCategoryType.Corruption
			];
			feature.DamageCategoryType = Collections.draw(options);
		}
	});
};

export const addItems = (combatant: CombatantModel) => {
	getProficiencies(combatant).forEach(prof => {
		const items = getItems(prof);
		const n = Random.randomNumber(items.length);
		const item = JSON.parse(JSON.stringify(items[n])) as ItemModel;
		combatant.items.push(item);
	});
};

export const getFeatureDeck = (combatant: CombatantModel) => {
	const s = getSpecies(combatant.speciesID);
	const r = getRole(combatant.roleID);
	const b = getBackground(combatant.backgroundID);

	return universalFeatures
		.concat(s ? s.features : [])
		.concat(r ? r.features : [])
		.concat(b ? b.features : []);
};

export const getActionDeck = (combatant: CombatantModel) => {
	const s = getSpecies(combatant.speciesID);
	const r = getRole(combatant.roleID);
	const b = getBackground(combatant.backgroundID);

	let list = universalActions
		.concat(s ? s.actions : [])
		.concat(r ? r.actions : [])
		.concat(b ? b.actions : []);

	combatant.items.forEach(i => {
		list = list.concat(i.actions);
	});

	return list;
};

export const getCardSource = (combatant: CombatantModel, cardID: string, cardType: 'action' | 'feature') => {
	switch (cardType) {
		case 'action': {
			if (universalActions.find(a => a.id === cardID)) {
				return 'Universal';
			}

			const s = getSpecies(combatant.speciesID);
			if (!!s && s.actions.find(c => c.id === cardID)) {
				return s.name;
			}

			const r = getRole(combatant.roleID);
			if (!!r && r.actions.find(c => c.id === cardID)) {
				return r.name;
			}

			const b = getBackground(combatant.backgroundID);
			if (!!b && b.actions.find(c => c.id === cardID)) {
				return b.name;
			}

			combatant.items.forEach(item => {
				if (item.actions.find(a => a.id === cardID)) {
					return item.name;
				}
			});

			break;
		}
		case 'feature': {
			if (universalFeatures.find(f => f.id === cardID)) {
				return 'Universal';
			}

			const s = getSpecies(combatant.speciesID);
			if (!!s && s.features.find(c => c.id === cardID)) {
				return s.name;
			}

			const r = getRole(combatant.roleID);
			if (!!r && r.features.find(c => c.id === cardID)) {
				return r.name;
			}

			const b = getBackground(combatant.backgroundID);
			if (!!b && b.features.find(c => c.id === cardID)) {
				return b.name;
			}

			combatant.items.forEach(item => {
				if (item.features.find(f => f.id === cardID)) {
					return item.name;
				}
			});

			break;
		}
	}

	return null;
};

export const getFeatures = (combatant: CombatantModel) => {
	let list = ([] as FeatureModel[]).concat(combatant.features);
	combatant.items.forEach(i => {
		list = list.concat(i.features);
	});

	return list;
};

export const getTraitValue = (combatant: CombatantModel, trait: TraitType) => {
	let value = 1;

	getFeatures(combatant)
		.filter(f => f.type === FeatureType.Trait)
		.filter(f => (f.trait === trait) || (f.trait === TraitType.All))
		.forEach(f => value += f.rank);

	return Math.max(value, 0);
};

export const getSkillValue = (combatant: CombatantModel, skill: SkillType) => {
	let value = 0;

	getFeatures(combatant)
		.filter(f => f.type === FeatureType.Skill)
		.filter(f => (f.skill === skill) || (f.skill === SkillType.All))
		.forEach(f => value += f.rank);
	getFeatures(combatant)
		.filter(f => f.type === FeatureType.SkillCategory)
		.filter(f => (f.skillCategory === getSkillCategory(skill)) || (f.skillCategory === SkillCategoryType.All))
		.forEach(f => value += f.rank);

	return Math.max(value, 0);
};

export const getDamageBonusValue = (combatant: CombatantModel, damage: DamageType) => {
	let value = 0;

	getFeatures(combatant)
		.filter(f => f.type === FeatureType.DamageBonus)
		.filter(f => (f.damage === damage) || (f.damage === DamageType.All))
		.forEach(f => value += f.rank);
	getFeatures(combatant)
		.filter(f => f.type === FeatureType.DamageCategoryTypeBonus)
		.filter(f => (f.DamageCategoryType === getDamageCategoryType(damage)) || (f.DamageCategoryType === DamageCategoryType.All))
		.forEach(f => value += f.rank);

	return Math.max(value, 0);
};

export const getDamageResistanceValue = (combatant: CombatantModel, damage: DamageType) => {
	let value = 0;

	getFeatures(combatant)
		.filter(f => f.type === FeatureType.DamageResist)
		.filter(f => (f.damage === damage) || (f.damage === DamageType.All))
		.forEach(f => value += f.rank);
	getFeatures(combatant)
		.filter(f => f.type === FeatureType.DamageCategoryTypeResist)
		.filter(f => (f.DamageCategoryType === getDamageCategoryType(damage)) || (f.DamageCategoryType === DamageCategoryType.All))
		.forEach(f => value += f.rank);

	return Math.max(value, 0);
};

export const getProficiencies = (combatant: CombatantModel) => {
	const profs: ItemProficiencyType[] = [];

	getFeatures(combatant)
		.filter(f => f.type === FeatureType.Proficiency)
		.forEach(f => profs.push(f.proficiency));

	return profs;
};

export const getAuras = (combatant: CombatantModel) => {
	const auras: AuraModel[] = [];

	getFeatures(combatant)
		.filter(f => f.type === FeatureType.Aura)
		.forEach(f => {
			const original = auras.find(a => (a.type === f.aura) && (a.damage === f.damage) && (a.DamageCategoryType === f.DamageCategoryType));
			if (original) {
				original.rank += 1;
			} else {
				const aura = createAura(f);
				auras.push(aura);
			}
		});

	return auras;
};

export const getDamageCategoryType = (type: DamageType) => {
	switch (type) {
		case DamageType.All:
			return DamageCategoryType.All;
		case DamageType.Acid:
		case DamageType.Edged:
		case DamageType.Impact:
		case DamageType.Piercing:
			return DamageCategoryType.Physical;
		case DamageType.Cold:
		case DamageType.Electricity:
		case DamageType.Fire:
		case DamageType.Light:
		case DamageType.Sonic:
			return DamageCategoryType.Energy;
		case DamageType.Decay:
		case DamageType.Poison:
		case DamageType.Psychic:
			return DamageCategoryType.Corruption;
	}

	return DamageCategoryType.None;
};

export const getRandomDamageType = (category: DamageCategoryType = DamageCategoryType.Any) => {
	const options = [];

	switch (category) {
		case DamageCategoryType.Any:
			options.push(DamageType.Acid);
			options.push(DamageType.Cold);
			options.push(DamageType.Decay);
			options.push(DamageType.Edged);
			options.push(DamageType.Electricity);
			options.push(DamageType.Fire);
			options.push(DamageType.Impact);
			options.push(DamageType.Light);
			options.push(DamageType.Piercing);
			options.push(DamageType.Poison);
			options.push(DamageType.Psychic);
			options.push(DamageType.Sonic);
			break;
		case DamageCategoryType.Physical:
			options.push(DamageType.Acid);
			options.push(DamageType.Edged);
			options.push(DamageType.Impact);
			options.push(DamageType.Piercing);
			break;
		case DamageCategoryType.Energy:
			options.push(DamageType.Cold);
			options.push(DamageType.Electricity);
			options.push(DamageType.Fire);
			options.push(DamageType.Light);
			options.push(DamageType.Sonic);
			break;
		case DamageCategoryType.Corruption:
			options.push(DamageType.Decay);
			options.push(DamageType.Poison);
			options.push(DamageType.Psychic);
			break;
	}

	const n = Random.randomNumber(options.length);
	return options[n];
};

export const getRandomDamageCategoryType = () => {
	const options = [
		DamageCategoryType.Physical,
		DamageCategoryType.Energy,
		DamageCategoryType.Corruption
	];

	const n = Random.randomNumber(options.length);
	return options[n];
};

export const createEncounter = (region: CampaignMapRegionModel, heroes: CombatantModel[]): EncounterModel => {
	const seed = region.encounters[0];
	const rng = Random.getSeededRNG(seed);

	const monsters: CombatantModel[] = [];
	while (monsters.reduce((value, m) => value + m.level, 0) < heroes.reduce((value, h) => value + h.level, 0)) {
		switch (Random.randomNumber(10, rng)) {
			case 0: {
				// Add a new monster
				const monster = createCombatant(CombatantType.Monster);
				const speciesID = Collections.draw(getSpeciesDeck());
				const roleID = Collections.draw(getRoleDeck());
				const backgroundID = Collections.draw(getBackgroundDeck());
				applyCombatantCards(monster, speciesID, roleID, backgroundID);
				makeFeatureChoices(monster);
				addItems(monster);
				monsters.push(monster);
				break;
			}
			case 1:
			case 2:
			case 3: {
				// Add a monster we already have
				if (monsters.length > 0) {
					const n = Random.randomNumber(monsters.length, rng);
					const original = monsters[n];
					const monster = createCombatant(CombatantType.Monster);
					applyCombatantCards(monster, original.speciesID, original.roleID, original.backgroundID);
					makeFeatureChoices(monster);
					addItems(monster);
					monsters.push(monster);
				}
				break;
			}
			case 4:
			case 5:
			case 6:
			case 7:
			case 8:
			case 9: {
				// Level up a random monster
				if (monsters.length > 0) {
					const n = Random.randomNumber(monsters.length);
					const monster = monsters[n];
					incrementCombatantLevel(monster);
					makeFeatureChoices(monster);
				}
				break;
			}
		}
	}

	const checkedIDs: string[] = [];
	monsters.forEach(monster => {
		if (!checkedIDs.includes(monster.id)) {
			const duplicates = monsters.filter(m => m.name === monster.name);
			if (duplicates.length > 1) {
				let n = 1;
				duplicates.forEach(m => {
					m.name = `${m.name} ${n}`;
					n += 1;
				});
			}
			checkedIDs.push(...duplicates.map(m => m.id));
		}
	});

	const encounter: EncounterModel = {
		regionID: region.id,
		combatants: [],
		combatData: [],
		map: EncounterMapUtils.generateEncounterMap(rng)
	};

	encounter.combatants.push(...heroes);
	encounter.combatants.push(...monsters);
	encounter.combatants.forEach(c => encounter.combatData.push(createCombatData(c)));

	placeCombatants(encounter, rng);

	// If any monsters are not placed, remove them from the encounter
	const notPlacedIDs = encounter.combatData.filter(cd => (cd.position.x === Number.MIN_VALUE) || (cd.position.y === Number.MIN_VALUE)).map(cd => cd.id);
	encounter.combatants = encounter.combatants.filter(c => !notPlacedIDs.includes(c.id));
	encounter.combatData = encounter.combatData.filter(cd => !notPlacedIDs.includes(cd.id));

	return encounter;
};

const placeCombatants = (encounter: EncounterModel, rng: () => number) => {
	encounter.combatData.forEach(cd => {
		const size = getCombatantSize(encounter, cd.id);

		for (let i = 0; i <= 1000; ++i) {
			const n = Random.randomNumber(encounter.map.squares.length, rng);
			const square = encounter.map.squares[n];

			const squares = [];
			for (let x = square.x; x <= square.x + size - 1; ++x) {
				for (let y = square.y; y <= square.y + size - 1; ++y) {
					squares.push({ x: x, y: y });
				}
			}

			const occupiedSquares: { x: number; y: number }[] = [];
			encounter.combatData.forEach(data => occupiedSquares.push(...getCombatantSquares(encounter, data)));

			const canPlace = squares.every(sq => {
				const mapSquare = encounter.map.squares.find(ms => (ms.x === sq.x) && (ms.y === sq.y));
				if (!mapSquare) {
					// Off the map
					return false;
				} else if (mapSquare.type !== EncounterMapSquareType.Clear) {
					// Not a clear square
					return false;
				} else if (occupiedSquares.find(os => (os.x === sq.x) && (os.y === sq.y))) {
					// Someone else is here
					return false;
				}

				return true;
			});

			if (canPlace) {
				cd.position.x = square.x;
				cd.position.y = square.y;
				break;
			}
		}
	});
};

const getCombatantSquares = (encounter: EncounterModel, combatData: CombatDataModel) => {
	const squares = [];

	for (let x = combatData.position.x; x <= combatData.position.x + combatData.size - 1; ++x) {
		for (let y = combatData.position.y; y <= combatData.position.y + combatData.size - 1; ++y) {
			squares.push({ x: x, y: y });
		}
	}

	return squares;
};

export const rollInitiative = (encounter: EncounterModel) => {
	encounter.combatData.forEach(cd => {
		cd.initiative = Number.MIN_VALUE;

		const combatant = getCombatant(encounter, cd.id);
		if (combatant) {
			const speed = getTraitValue(combatant, TraitType.Speed);
			cd.initiative = Random.dice(speed);
		}
	});

	encounter.combatData.sort((a, b) => {
		const combatantA = getCombatant(encounter, a.id);
		const combatantB = getCombatant(encounter, a.id);

		// Sort by Inititive
		let result: number = b.initiative - a.initiative;

		if (result === 0) {
			// Sort by Speed
			const speedA = getTraitValue(combatantA as CombatantModel, TraitType.Speed);
			const speedB = getTraitValue(combatantB as CombatantModel, TraitType.Speed);
			result = speedB - speedA;
		}

		if (result === 0) {
			// Sort heroes before monsters
			const valueA = (a.type === CombatantType.Hero ? 1 : 0);
			const valueB = (b.type === CombatantType.Hero ? 1 : 0);
			result = valueB - valueA;
		}

		if (result === 0) {
			// Sort alphabetically
			const nameA = (combatantA as CombatantModel).name;
			const nameB = (combatantB as CombatantModel).name;
			result = (nameA < nameB) ? -1 : +1;
		}

		return result;
	});
};

export const startOfTurn = (encounter: EncounterModel, combatData: CombatDataModel) => {
	const combatant = encounter.combatants.find(c => c.id === combatData.id) as CombatantModel;

	combatData.hidden = 0;
	combatData.senses = 0;
	combatData.movement = 0;

	if (combatData.state === CombatDataState.Unconscious) {
		const result = Random.dice(getTraitValue(combatant, TraitType.Resolve));
		if (result < 8) {
			combatData.state = CombatDataState.Dead;
		}
	}

	combatData.conditions
		.filter(condition => condition.type === ConditionType.Health)
		.forEach(condition => {
			// TODO: Apply this auto-heal / auto-damage condition
		});

	// TODO: Apply 'auto-healing' effects from auras
	// TODO: Apply 'auto-damage' effects from auras

	if ((combatData.state === CombatDataState.Standing) || (combatData.state === CombatDataState.Prone)) {
		combatData.senses = Random.dice(getSkillValue(combatant, SkillType.Perception));
		combatData.movement = Random.dice(getTraitValue(combatant, TraitType.Speed));
		// TODO: Apply movement conditions

		combatData.actions = Collections.shuffle(getActionDeck(combatant)).splice(0, 3);
	}
};

export const endOfTurn = (encounter: EncounterModel, combatData: CombatDataModel) => {
	const combatant = encounter.combatants.find(c => c.id === combatData.id) as CombatantModel;

	combatData.initiative = Number.MIN_VALUE;
	combatData.senses = 0;
	combatData.movement = 0;

	combatData.conditions.forEach(condition => {
		if (condition.beneficial) {
			condition.rank -= 1;
		} else {
			const trait = getTraitValue(combatant, condition.trait);
			if (Random.dice(trait) >= Random.dice(condition.rank)) {
				condition.rank = 0;
			} else {
				condition.rank -= 1;
			}
		}
	});
	combatData.conditions = combatData.conditions.filter(c => c.rank > 0);
};

export const getMoveCost = (encounter: EncounterModel, combatData: CombatDataModel, dir: string) => {
	const combatant = getCombatant(encounter, combatData.id) as CombatantModel;

	const movingFrom = getCombatantSquares(encounter, combatData);
	const movingTo = movingFrom.map(sq => {
		const dest = { x: sq.x, y: sq.y };
		switch (dir) {
			case 'n':
				dest.y -= 1;
				break;
			case 'ne':
				dest.x += 1;
				dest.y -= 1;
				break;
			case 'e':
				dest.x += 1;
				break;
			case 'se':
				dest.x += 1;
				dest.y += 1;
				break;
			case 's':
				dest.y += 1;
				break;
			case 'sw':
				dest.x -= 1;
				dest.y += 1;
				break;
			case 'w':
				dest.x -= 1;
				break;
			case 'nw':
				dest.x -= 1;
				dest.y -= 1;
				break;
		}
		return dest;
	});

	const destinationMapSquares = movingTo
		.map(sq => encounter.map.squares.find(ms => (ms.x === sq.x) && (ms.y === sq.y)) ?? null)
		.filter(ms => ms !== null) as EncounterMapSquareModel[];

	// Can't move off the map
	if (destinationMapSquares.length !== movingTo.length) {
		return Number.MAX_VALUE;
	}

	// Can't move into an occupied square
	const occupied: { x: number; y: number }[] = [];
	encounter.combatData.forEach(cd => {
		const squares = getCombatantSquares(encounter, cd);
		occupied.push(...squares);
	});
	if (movingTo.some(sq => occupied.find(os => (os.x === sq.x) && (os.y === sq.y)))) {
		return Number.MAX_VALUE;
	}

	let cost = 1;

	// Obstructed: +1
	if (destinationMapSquares.some(ms => ms.type === EncounterMapSquareType.Obstructed)) {
		cost += 1;
	}

	// Moving out of a space adjacent to standing opponent: +4
	const adjacent: { x: number; y: number }[] = [];
	encounter.combatData
		.filter(cd => cd.type !== combatant.type)
		.filter(cd => cd.state === CombatDataState.Standing)
		.forEach(cd => {
			const current = getCombatantSquares(encounter, cd);
			const squares = EncounterMapUtils.getEncounterMapAdjacentSquares(encounter.map, current);
			adjacent.push(...squares);
		});
	if (movingFrom.some(sq => adjacent.find(os => (os.x === sq.x) && (os.y === sq.y)))) {
		cost += 4;
	}

	// TODO: Apply ease movement effects from auras
	// TODO: Apply prevent movement effects from auras

	// Prone or hidden: x2
	if ((combatData.state === CombatDataState.Prone) || (combatData.hidden > 0)) {
		cost *= 2;
	}

	return cost;
};

export const move = (combatData: CombatDataModel, dir: string, cost: number) => {
	combatData.movement -= cost;

	switch (dir) {
		case 'n':
			combatData.position.y -= 1;
			break;
		case 'ne':
			combatData.position.x += 1;
			combatData.position.y -= 1;
			break;
		case 'e':
			combatData.position.x += 1;
			break;
		case 'se':
			combatData.position.x += 1;
			combatData.position.y += 1;
			break;
		case 's':
			combatData.position.y += 1;
			break;
		case 'sw':
			combatData.position.x -= 1;
			combatData.position.y += 1;
			break;
		case 'w':
			combatData.position.x -= 1;
			break;
		case 'nw':
			combatData.position.x -= 1;
			combatData.position.y -= 1;
			break;
	}
};

export const standUpSitDown = (combatData: CombatDataModel) => {
	switch (combatData.state) {
		case CombatDataState.Standing:
			combatData.movement -= 1;
			combatData.state = CombatDataState.Prone;
			break;
		case CombatDataState.Prone:
			combatData.movement -= 8;
			combatData.state = CombatDataState.Standing;
			break;
	}
};

export const scan = (encounter: EncounterModel, combatData: CombatDataModel) => {
	const combatant = getCombatant(encounter, combatData.id) as CombatantModel;
	let perception = getSkillValue(combatant, SkillType.Perception);
	if (combatData.state === CombatDataState.Prone) {
		perception = Math.floor(perception / 2);
	}

	combatData.movement -= 4;
	combatData.senses = Random.dice(perception);
};

export const hide = (encounter: EncounterModel, combatData: CombatDataModel) => {
	const combatant = getCombatant(encounter, combatData.id) as CombatantModel;
	let stealth = getSkillValue(combatant, SkillType.Stealth);
	if (combatData.state === CombatDataState.Prone) {
		stealth = Math.floor(stealth / 2);
	}

	combatData.movement -= 4;
	combatData.hidden = Random.dice(stealth);
};

export const getEncounterState = (encounter: EncounterModel): EncounterState => {
	const allMonstersDead = encounter.combatData
		.filter(cd => cd.type === CombatantType.Monster)
		.every(cd => cd.state === CombatDataState.Dead);
	if (allMonstersDead) {
		return EncounterState.Won;
	}
	const allHeroesDead = encounter.combatData
		.filter(cd => cd.type === CombatantType.Hero)
		.every(cd => cd.state === CombatDataState.Dead);
	if (allHeroesDead) {
		return EncounterState.Defeated;
	}

	return EncounterState.Active;
};

export const getCombatant = (encounter: EncounterModel, id: string): CombatantModel | null => {
	return encounter.combatants.find(c => c.id === id) ?? null;
};

export const getCombatData = (encounter: EncounterModel, id: string): CombatDataModel | null => {
	return encounter.combatData.find(c => c.id === id) ?? null;
};

export const getCombatantSize = (encounter: EncounterModel, id: string): number => {
	const combatant = getCombatant(encounter, id);
	if (combatant) {
		return combatant.size;
	}

	return 1;
};

export const getActiveCombatants = (encounter: EncounterModel) => {
	return encounter.combatData
		.filter(cd => cd.state !== CombatDataState.Dead)
		.filter(cd => cd.initiative !== Number.MIN_VALUE);
};

export const getAllHeroesInEncounter = (encounter: EncounterModel): CombatantModel[] => {
	return encounter.combatants.filter(c => c.type === CombatantType.Hero);
};

export const getSurvivingHeroes = (encounter: EncounterModel): CombatantModel[] => {
	return getAllHeroesInEncounter(encounter).filter(h => {
		const combatData = getCombatData(encounter, h.id) as CombatDataModel;
		return (combatData.state !== CombatDataState.Dead) && (combatData.state !== CombatDataState.Unconscious);
	});
};

export const getFallenHeroes = (encounter: EncounterModel): CombatantModel[] => {
	return getAllHeroesInEncounter(encounter).filter(h => {
		const combatData = getCombatData(encounter, h.id) as CombatDataModel;
		return (combatData.state === CombatDataState.Dead) || (combatData.state === CombatDataState.Unconscious);
	});
};

export const getDeadHeroes = (encounter: EncounterModel): CombatantModel[] => {
	return getAllHeroesInEncounter(encounter).filter(h => {
		const combatData = getCombatData(encounter, h.id) as CombatDataModel;
		return (combatData.state === CombatDataState.Dead);
	});
};

export const getFeatureTitle = (feature: FeatureModel) => {
	switch (feature.type) {
		case FeatureType.Trait:
			return 'Trait bonus';
		case FeatureType.Skill:
		case FeatureType.SkillCategory:
			return 'Skill bonus';
		case FeatureType.Proficiency:
			return 'Proficiency';
		case FeatureType.DamageBonus:
		case FeatureType.DamageCategoryTypeBonus:
			return 'Damage Bonus';
		case FeatureType.DamageResist:
		case FeatureType.DamageCategoryTypeResist:
			return 'Resistance';
		case FeatureType.Aura:
			return 'Aura';
	}
};

export const getFeatureDescription = (feature: FeatureModel) => {
	switch (feature.type) {
		case FeatureType.Trait:
			return `${feature.trait} ${feature.rank > 0 ? '+' : ''}${feature.rank}`;
		case FeatureType.Skill:
			return `${feature.skill} ${feature.rank > 0 ? '+' : ''}${feature.rank}`;
		case FeatureType.SkillCategory:
			return `All ${feature.skillCategory} skills ${feature.rank > 0 ? '+' : ''}${feature.rank}`;
		case FeatureType.Proficiency:
			return `${feature.proficiency}`;
		case FeatureType.DamageBonus:
			return `${feature.damage} ${feature.rank > 0 ? '+' : ''}${feature.rank}`;
		case FeatureType.DamageCategoryTypeBonus:
			return `All ${feature.DamageCategoryType} types ${feature.rank > 0 ? '+' : ''}${feature.rank}`;
		case FeatureType.DamageResist:
			return `${feature.damage} ${feature.rank > 0 ? '+' : ''}${feature.rank}`;
		case FeatureType.DamageCategoryTypeResist:
			return `All ${feature.DamageCategoryType} types ${feature.rank > 0 ? '+' : ''}${feature.rank}`;
		case FeatureType.Aura: {
			const aura = createAura(feature);
			return `${getAuraDescription(aura)} ${feature.rank > 0 ? '+' : ''}${feature.rank}`;
		}
	}
};

export const hasChoice = (feature: FeatureModel) => {
	switch (feature.type) {
		case FeatureType.Trait:
			return feature.trait === TraitType.Any;
		case FeatureType.Skill:
			return feature.skill === SkillType.Any;
		case FeatureType.SkillCategory:
			return feature.skillCategory === SkillCategoryType.Any;
		case FeatureType.Proficiency:
			return feature.proficiency === ItemProficiencyType.Any;
		case FeatureType.DamageBonus:
		case FeatureType.DamageResist:
			return feature.damage === DamageType.Any;
		case FeatureType.DamageCategoryTypeBonus:
		case FeatureType.DamageCategoryTypeResist:
			return feature.DamageCategoryType === DamageCategoryType.Any;
	}

	return false;
};

export const createGame = (): GameModel => {
	return {
		heroes: [
			createCombatant(CombatantType.Hero),
			createCombatant(CombatantType.Hero),
			createCombatant(CombatantType.Hero),
			createCombatant(CombatantType.Hero),
			createCombatant(CombatantType.Hero)
		],
		items: [],
		boons: [],
		map: CampaignMapUtils.generateCampaignMap(),
		encounter: null
	};
};

export const addHeroToGame = (game: GameModel, hero: CombatantModel) => {
	const index = game.heroes.findIndex(h => h.id === hero.id);
	if (index === -1) {
		game.heroes.push(hero);
	} else {
		game.heroes[index] = hero;
	}
	game.heroes.sort((a, b) => (a.name > b.name ? 1 : -1));
};

export const getRandomItemProficiency = () => {
	const options = [
		ItemProficiencyType.MilitaryWeapons,
		ItemProficiencyType.LargeWeapons,
		ItemProficiencyType.PairedWeapons,
		ItemProficiencyType.RangedWeapons,
		ItemProficiencyType.PowderWeapons,
		ItemProficiencyType.Implements,
		ItemProficiencyType.LightArmor,
		ItemProficiencyType.HeavyArmor,
		ItemProficiencyType.Shields
	];

	const n = Random.randomNumber(options.length);
	return options[n];
};

export const getSkillCategory = (skill: SkillType) => {
	switch (skill) {
		case SkillType.All:
			return SkillCategoryType.All;
		case SkillType.Brawl:
		case SkillType.Stealth:
		case SkillType.Weapon:
			return SkillCategoryType.Physical;
		case SkillType.Perception:
		case SkillType.Reactions:
		case SkillType.Spellcasting:
			return SkillCategoryType.Mental;
	}

	return SkillCategoryType.None;
};

export const getRandomSkill = (category: SkillCategoryType = SkillCategoryType.Any) => {
	const options = [];

	switch (category) {
		case SkillCategoryType.Any:
			options.push(SkillType.Brawl);
			options.push(SkillType.Perception);
			options.push(SkillType.Reactions);
			options.push(SkillType.Spellcasting);
			options.push(SkillType.Stealth);
			options.push(SkillType.Weapon);
			break;
		case SkillCategoryType.Physical:
			options.push(SkillType.Brawl);
			options.push(SkillType.Stealth);
			options.push(SkillType.Weapon);
			break;
		case SkillCategoryType.Mental:
			options.push(SkillType.Perception);
			options.push(SkillType.Reactions);
			options.push(SkillType.Spellcasting);
			break;
	}

	const n = Random.randomNumber(options.length);
	return options[n];
};

export const getRandomSkillCategory = () => {
	const options = [
		SkillCategoryType.Physical,
		SkillCategoryType.Mental
	];

	const n = Random.randomNumber(options.length);
	return options[n];
};

export const getRandomTrait = () => {
	const options = [
		TraitType.Endurance,
		TraitType.Resolve,
		TraitType.Speed
	];

	const n = Random.randomNumber(options.length);
	return options[n];
};

export const getBackground = (id: string) => {
	return BackgroundList.find(b => b.id === id);
};

export const getBackgroundDeck = (game: GameModel | null = null) => {
	if (game) {
		const used = game.heroes.map(h => h.backgroundID);

		const deck = BackgroundList
			.filter(background => !used.includes(background.id))
			.map(background => background.id);

		if (deck.length >= 3) {
			return deck;
		}
	}

	return BackgroundList.map(background => background.id);
};

export const getRole = (id: string) => {
	return RoleList.find(r => r.id === id);
};

export const getRoleDeck = (game: GameModel | null = null) => {
	if (game) {
		const used = game.heroes.map(h => h.roleID);

		const deck = RoleList
			.filter(role => !used.includes(role.id))
			.map(role => role.id);

		if (deck.length >= 3) {
			return deck;
		}
	}

	return RoleList.map(role => role.id);
};

export const getSpecies = (id: string) => {
	const all = ([] as SpeciesModel[]).concat(HeroSpeciesList).concat(MonsterSpeciesList);
	return all.find(s => s.id === id);
};

export const getSpeciesDeck = (game: GameModel | null = null) => {
	if (game) {
		const used = game.heroes.map(h => h.speciesID);

		const deck = HeroSpeciesList
			.filter(species => !used.includes(species.id))
			.map(species => species.id);

		if (deck.length >= 3) {
			return deck;
		}

		return HeroSpeciesList.map(species => species.id);
	}

	return MonsterSpeciesList.map(species => species.id);
};

export const getItem = (id: string) => {
	return ItemList.find(b => b.id === id);
};

export const getItems = (proficiency: ItemProficiencyType) => {
	return ItemList.filter(i => i.proficiency === proficiency);
};
