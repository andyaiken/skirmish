import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Main } from './components/main/main';

import './index.scss';

const container = document.getElementById('root');
if (container) {
	const root = createRoot(container);
	root.render(
		<StrictMode>
			<Main />
		</StrictMode>
	);
}
