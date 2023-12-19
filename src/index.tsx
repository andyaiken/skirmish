import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Platform } from './platform/platform';

import { Layout } from './components/layout/layout';

import './index.scss';

const platform = new Platform();
platform
	.logIn()
	.then(data => {
		const container = document.getElementById('root');
		if (container) {
			const root = createRoot(container);
			root.render(
				<StrictMode>
					<Layout game={data.game} options={data.options} platform={platform} />
				</StrictMode>
			);
		}
	});
