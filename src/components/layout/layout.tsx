import { useMediaQuery } from 'react-responsive';

import type { GameModel } from '../../models/game';
import type { OptionsModel } from '../../models/options';

import { Main } from '../main/main';

import './layout.scss';

interface Props {
	game: GameModel | null;
	options: OptionsModel;
}

export const Layout = (props: Props) => {
	const isWideEnough = useMediaQuery({ query: '(min-width: 1024px)' });
	const isTallEnough = useMediaQuery({ query: '(min-height: 1024px)' });
	const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });

	if (isWideEnough) {
		return (
			<Main
				game={props.game}
				options={props.options}
			/>
		);
	}

	if (isPortrait && isTallEnough) {
		return (
			<div className='layout'>
				To play Skirmish, use your device in landscape mode.
			</div>
		);
	}

	return (
		<div className='layout'>
			To play Skirmish, use a device with a larger screen.
		</div>
	);
};
