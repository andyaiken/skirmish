import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import localforage from 'localforage';

import { StructureData } from './data/structure-data';

import { StrongholdLogic } from './logic/stronghold-logic';

import type { GameModel } from './models/game';
import type { OptionsModel } from './models/options';

import { Layout } from './components/layout/layout';

import './index.scss';

localforage.getItem<GameModel>('skirmish-game').then(game => {
	if (game) {
		if (game.structureSlots === undefined) {
			game.structureSlots = 0;
		}

		game.heroes.forEach(h => {
			if (h.faction === undefined) {
				h.faction = h.type;
			}
		});

		if (!game.stronghold) {
			game.stronghold = [];
			StrongholdLogic.addStructure(game.stronghold, StructureData.barracks());
			StrongholdLogic.addStructure(game.stronghold, StructureData.barracks());
		}

		if (game.encounter) {
			game.encounter.combatants.forEach(c => {
				if (c.faction === undefined) {
					c.faction = c.type;
				}
			});

			game.encounter.loot.forEach(lp => {
				if (lp.money === undefined) {
					lp.money = 0;
				}
			});
		}

		game.map.regions.forEach(region => {
			if (region.colorLight === undefined) {
				region.colorLight = region.color;
			}
			if (region.colorDark === undefined) {
				region.colorDark = region.color;
			}
		});

		game.map.regions
			.filter(r => r.encounters.length > 10)
			.forEach(r => {
				r.encounters = r.encounters.slice(0, 9);
			});
	}

	localforage.getItem<OptionsModel>('skirmish-options').then(options => {
		if (!options) {
			options = {
				developer: false,
				showTips: true,
				soundEffectsVolume: 0.5,
				packIDs: []
			};
		}

		if (options.showTips === undefined) {
			options.showTips = true;
		}

		if (options.packIDs === undefined) {
			options.packIDs = [];
		}

		const container = document.getElementById('root');
		if (container) {
			const root = createRoot(container);
			root.render(
				<StrictMode>
					<Layout game={game} options={options} />
				</StrictMode>
			);
		}
	});
});
