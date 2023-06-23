import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import localforage from 'localforage';

import type { GameModel } from './models/game';
import type { OptionsModel } from './models/options';

import { Main } from './components/main/main';

import './index.scss';

localforage.getItem<GameModel>('skirmish-game').then(game => {
	if (game && game.encounter && (game.encounter.log === undefined)) {
		game.encounter.log = [];
	}

	localforage.getItem<OptionsModel>('skirmish-options').then(options => {
		if (!options) {
			options = {
				developer: false,
				soundEffectsVolume: 0.5
			};
		}
		const container = document.getElementById('root');
		if (container) {
			const root = createRoot(container);
			root.render(
				<StrictMode>
					<Main game={game} options={options} />
				</StrictMode>
			);
		}
	});
});
