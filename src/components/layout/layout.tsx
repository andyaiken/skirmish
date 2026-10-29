import { useState } from 'react';

import { PageType } from '../../enums/page-type';
import { ScreenType } from '../../enums/screen-type';

import { LayoutLogic } from '../../logic/layout/layout-logic';

import { useEdgesAtLeast, useHeightAtLeast, useIsLandscape, useWidthAtLeast } from '../../utils/available-space/available-space';

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
	// real one.
	//
	// A short edge and a long edge rather than a width and a height, so the answer doesn't
	// change as a device turns over, and so there is no square-shaped hole between two
	// rectangles - the pair of them the gate used to be turned a folding phone opened out
	// away in both of its opened states. Of the room rather than the window, as everything
	// else here is.
	//
	// The floors are what the game needs rather than what any device happens to be: the
	// smallest iPhone, at 320x568, clears both with room to spare, and what they shut out
	// is a window dragged to a size nothing can be laid out in.
	const isBigEnough = useEdgesAtLeast(LayoutLogic.minShortEdge, LayoutLogic.minLongEdge);

	// Every question a screen can ask about its space is asked here, because this is the only
	// component with hooks - the screens are classes. Each is about room for one particular thing,
	// and the sizes they come from are in LayoutLogic. They are all asked every time, so the hooks
	// keep their order, and a screen reads the ones it cares about.
	//
	// Of the space the app has rather than of the window, because they are not the same thing and
	// the difference is a layout: on the largest iPhones held sideways the safe area takes 124pt
	// off the width, which is the difference between the encounter screen's roomy layout and a map
	// squeezed to 242pt. The gate above asks the same way, of the same measurement.
	const isLandscape = useIsLandscape();
	const layout = LayoutLogic.getModel(isLandscape, {
		roomForPanelsBesideMap: useWidthAtLeast(LayoutLogic.widthForPanelsBesideMap),
		roomForPanelsBelowMap: useWidthAtLeast(LayoutLogic.widthForPanelsBelowMap),
		roomForSelectorBand: useHeightAtLeast(LayoutLogic.heightForSelectorBand),
		roomForSelectorColumns: useWidthAtLeast(LayoutLogic.widthForSelectorColumns),
		roomForBranding: useWidthAtLeast(LayoutLogic.widthForBranding),
		roomForSidebarRow: useWidthAtLeast(LayoutLogic.widthForSidebarRow)
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
