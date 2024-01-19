import { useMediaQuery } from 'react-responsive';
import { useState } from 'react';

import { OrientationType } from '../../enums/orientation-type';
import { PageType } from '../../enums/page-type';
import { ScreenType } from '../../enums/screen-type';

import type { GameModel } from '../../models/game';
import type { OptionsModel } from '../../models/options';

import type { Platform } from '../../platform/platform';

import { Main } from '../main/main';

import './layout.scss';

interface Props {
	game: GameModel | null;
	options: OptionsModel;
	platform: Platform;
}

export const Layout = (props: Props) => {

	const [ screen, setScreen ] = useState(ScreenType.Landing);
	const [ page, setPage ] = useState(PageType.Island);

	const isLandscapeWidth = useMediaQuery({ query: '(min-width: 1024px)' });
	const isLandscapeHeight = useMediaQuery({ query: '(min-height: 768px)' });
	const isPortraitWidth = useMediaQuery({ query: '(min-width: 768px)' });
	const isPortraitHeight = useMediaQuery({ query: '(min-height: 1024px)' });

	if (isLandscapeWidth && isLandscapeHeight) {
		return (
			<Main
				game={props.game}
				options={props.options}
				platform={props.platform}
				orientation={OrientationType.Landscape}
				screen={screen}
				page={page}
				setScreen={setScreen}
				setPage={setPage}
			/>
		);
	}

	if (isPortraitWidth && isPortraitHeight) {
		return (
			<Main
				game={props.game}
				options={props.options}
				platform={props.platform}
				orientation={OrientationType.Portrait}
				screen={screen}
				page={page}
				setScreen={setScreen}
				setPage={setPage}
			/>
		);
	}

	return (
		<div className='layout'>
			To play Skirmish, use a device with a larger screen.
		</div>
	);
};
