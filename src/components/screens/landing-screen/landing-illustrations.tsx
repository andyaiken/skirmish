import { BoonType } from '../../../enums/boon-type';

import { CampaignMapGenerator } from '../../../generators/campaign-map/campaign-map-generator';
import { CombatantLogic } from '../../../logic/combatant/combatant-logic';
import { EncounterGenerator } from '../../../generators/encounter/encounter-generator';
import { HeroGenerator } from '../../../generators/hero/hero-generator';
import { MagicItemGenerator } from '../../../generators/magic-item/magic-item-generator';

import type { BoonModel } from '../../../models/boon';
import type { CampaignMapModel } from '../../../models/campaign-map';
import type { CombatantModel } from '../../../models/combatant';
import type { EncounterModel } from '../../../models/encounter';
import type { ItemModel } from '../../../models/item';
import type { OptionsModel } from '../../../models/options';

import { Random } from '../../../utils/random/random';

import { BoonCard, ItemCard } from '../../cards';
import { CampaignMapPanel, EncounterMapPanel } from '../../panels';
import { ScaleToFit } from '../../controls';

// The map square size the encounter map is drawn at before it is scaled down to fit
const SQUARE_SIZE = 20;

// Everything is generated from the base game alone, from fixed seeds, so the start page shows
// the same pictures on every visit whichever packs the player has
interface Illustrations {
	map: CampaignMapModel;
	encounter: EncounterModel;
	money: BoonModel;
	magicItem: ItemModel;
}

let illustrations: Illustrations | null = null;

const getIllustrations = (): Illustrations => {
	if (!illustrations) {
		const rng = Random.getSeededRNG('landing');

		const map = CampaignMapGenerator.generateCampaignMap([], rng);

		const heroes: CombatantModel[] = [];
		while (heroes.length < 4) {
			const hero = HeroGenerator.generateHero([], heroes, rng);
			CombatantLogic.resetCombatant(hero);
			heroes.push(hero);
		}
		const encounter = EncounterGenerator.createEncounter(map.regions[0], heroes, []);

		const item = MagicItemGenerator.generateRandomMagicItem([], rng);

		illustrations = {
			map: map,
			encounter: encounter,
			money: {
				id: 'landing-money',
				type: BoonType.Money,
				data: 200
			},
			magicItem: item
		};
	}

	return illustrations;
};

export const IslandIllustration = (props: { options: OptionsModel }) => {
	return (
		<div className='landing-illustration island'>
			<CampaignMapPanel map={getIllustrations().map} options={props.options} selectedRegion={null} />
		</div>
	);
};

export const EncounterIllustration = () => {
	const encounter = getIllustrations().encounter;

	const width = Math.max(...encounter.mapSquares.map(sq => sq.x)) - Math.min(...encounter.mapSquares.map(sq => sq.x)) + 3;
	const height = Math.max(...encounter.mapSquares.map(sq => sq.y)) - Math.min(...encounter.mapSquares.map(sq => sq.y)) + 3;

	return (
		<div className='landing-illustration encounter'>
			<ScaleToFit>
				<div style={{ width: `${width * SQUARE_SIZE}px`, height: `${height * SQUARE_SIZE}px` }}>
					<EncounterMapPanel
						encounter={encounter}
						squareSize={SQUARE_SIZE}
						selectableCombatantIDs={[]}
						selectableLootIDs={[]}
						selectableTrapIDs={[]}
						selectableSquares={[]}
						selectedCombatantIDs={[]}
						selectedLootIDs={[]}
						selectedTrapIDs={[]}
						selectedSquares={[]}
						onClickCombatant={() => null}
						onClickLoot={() => null}
						onClickTrap={() => null}
						onClickSquare={() => null}
						onClickOff={() => null}
					/>
				</div>
			</ScaleToFit>
		</div>
	);
};

export const MoneyIllustration = () => {
	return (
		<div className='landing-illustration card'>
			<ScaleToFit>
				<BoonCard boon={getIllustrations().money} />
			</ScaleToFit>
		</div>
	);
};

export const MagicItemIllustration = () => {
	return (
		<div className='landing-illustration card'>
			<ScaleToFit>
				<ItemCard item={getIllustrations().magicItem} />
			</ScaleToFit>
		</div>
	);
};
