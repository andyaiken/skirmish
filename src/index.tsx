import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import toast from 'react-hot-toast';

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

// Registered after the render above because the prompt is a toast, and the Toaster
// it goes to is mounted by Layout. The service worker registers on window load, so
// there is no chance of a new version arriving before that happens.
const updateSW = registerSW({
	onNeedRefresh: () => {
		toast.custom(t => (
			<div key={t.id} className='skirmish-notification'>
				A new version of Skirmish is available.
				<div className='notification-actions'>
					<button className='link' onClick={() => { toast.remove(t.id); updateSW(true); }}>Reload</button>
					<button className='link' onClick={() => toast.remove(t.id)}>Not now</button>
				</div>
			</div>
		), { duration: Infinity });
	}
});
