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

	// Main is always rendered, whatever the screen size, and the too-small message is laid
	// over the top of it. Swapping Main out for the message instead would unmount it, and
	// Main holds the campaign being played: it would come back with the game as it was at
	// launch, losing an encounter in progress and then saving that stale game over the
	// real one. A device rotating passes through exactly that state, because the queries
	// below do not change in the same instant - briefly the new width is known and the old
	// height still is, which matches neither size.
	//
	// 740 rather than 768 on the short edge, because the iPad mini is 744pt there and was
	// the one current iPad the old threshold shut out - in both orientations, since 744
	// is its width in portrait and its height in landscape.
	const isBigEnough = useMediaQuery({ query: '(min-width: 1024px) and (min-height: 740px), (min-width: 740px) and (min-height: 1024px)' });
	const isLandscape = useMediaQuery({ query: '(orientation: landscape)' });

	return (
		<>
			<Main
				game={props.game}
				options={props.options}
				platform={props.platform}
				orientation={isLandscape ? OrientationType.Landscape : OrientationType.Portrait}
				screen={screen}
				page={page}
				setScreen={setScreen}
				setPage={setPage}
			/>
			{
				isBigEnough ?
					null
					: <div className='layout'>To play Skirmish, use a device with a larger screen.</div>
			}
		</>
	);
};
