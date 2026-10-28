import { useState } from 'react';

import { PageType } from '../../enums/page-type';
import { ScreenType } from '../../enums/screen-type';

import { LayoutLogic } from '../../logic/layout/layout-logic';

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
	// Every question a screen can ask about its space is asked here, because this is the only
	// component with hooks - the screens are classes. Each is about room for one particular thing,
	// and the sizes they come from are in LayoutLogic. They are all asked every time, so the hooks
	// keep their order, and a screen reads the ones it cares about.
	const isLandscape = useMediaQuery(LayoutLogic.queries.landscape);
	const layout = LayoutLogic.getModel(isLandscape, {
		roomForPanelsBesideMap: useMediaQuery(LayoutLogic.queries.panelsBesideMap),
		roomForPanelsBelowMap: useMediaQuery(LayoutLogic.queries.panelsBelowMap),
		roomForSelectorBand: useMediaQuery(LayoutLogic.queries.selectorBand),
		roomForBranding: useMediaQuery(LayoutLogic.queries.branding)
	});

	return (
		<>
			<Main
				game={props.game}
				options={props.options}
				platform={props.platform}
				layout={layout}
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
