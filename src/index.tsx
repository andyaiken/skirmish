import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Platform } from './platform/platform';

import { ErrorBoundary } from './components/controls';
import { Layout } from './components/layout/layout';

import './index.scss';

if (window.navigator.storage && window.navigator.storage.persist) {
	window.navigator.storage
		.persist()
		.catch(() => {
			// Nothing to do here
		});
}

const platform = new Platform();
const { game, options } = await platform
	.logIn()
	.catch(ex => {
		// A save written by an older version can be unreadable; start fresh rather than showing a blank page.
		platform.logException(ex);
		return { game: null, options: platform.getDefaultOptions() };
	});

const container = document.getElementById('root');
if (container) {
	const root = createRoot(container);
	root.render(
		<StrictMode>
			<ErrorBoundary className='layout'>
				<Layout game={game} options={options} platform={platform} />
			</ErrorBoundary>
		</StrictMode>
	);
}
