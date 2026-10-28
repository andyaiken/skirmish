import { useState } from 'react';

import { PageType } from '../../enums/page-type';
import { ScreenType } from '../../enums/screen-type';

import { OrientationLogic } from '../../logic/orientation/orientation-logic';

import { useMediaQuery } from '../../utils/media-query/media-query';

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
	const isBigEnough = useMediaQuery('(min-width: 1024px) and (min-height: 740px), (min-width: 740px) and (min-height: 1024px)');
	const isLandscape = useMediaQuery('(orientation: landscape)');

	// Whether this is a phone rather than a tablet. Every iPhone has a short edge of 440pt or less
	// and the smallest iPad 744, so 500 separates them with room on both sides. Asking about either
	// dimension rather than the width means the answer is the same whichever way up it is held, and
	// so does not change under the player's hands during a rotation.
	const isSmall = useMediaQuery('(max-width: 500px), (max-height: 500px)');

	return (
		<>
			<Main
				game={props.game}
				options={props.options}
				platform={props.platform}
				orientation={OrientationLogic.getOrientation(isLandscape, isSmall)}
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
