import type { LayoutModel } from '../../models/layout';

import { OrientationLogic } from '../orientation/orientation-logic';

// The questions a screen can ask about the space it has, and the sizes the answers come from.
//
// Every number here is the size of something the game actually draws, and every threshold is a sum
// of those sizes. None of them is a device's dimensions, which is the point: a threshold picked
// from a phone's width is right until something arrives that is not a phone, and then it is wrong
// in a way that no amount of adjusting it fixes. Change what the game draws and these follow.
export class LayoutLogic {
	// --- the encounter screen's map and panels ---
	//
	// It is the only screen that puts two panels beside or below the map, so it runs out of room
	// first; every other screen still has slack left when it does.

	// Below this the map is too small to play on.
	static minMapWidth = 350;

	// Below this a panel is too narrow to read.
	static minPanelWidth = 235;

	// The two side columns, and the gaps and screen padding around them.
	static panelWidths = 250 + 300;
	static layoutGaps = 30;

	// --- the campaign screen's page selector ---

	static topBarHeight = 60;

	// The selector as a band across the top: its options plus its margins.
	static selectorBandHeight = 77;

	// What the page below it needs to be worth showing.
	static minCampaignContentHeight = 450;

	// --- the campaign screen's top bar ---
	//
	// Measured from the bar that did not fit: 467px of content on a 390px screen, which is where
	// the help button went over the edge.

	static brandingWidth = 175;
	static moneyWidth = 90;
	static topBarButtonsWidth = 100;
	static topBarSpacing = 105;

	// --- the thresholds those sizes add up to ---

	// Landscape puts the panels beside the map, so the map's floor plus both panels.
	static widthForPanelsBesideMap = LayoutLogic.minMapWidth + LayoutLogic.panelWidths + LayoutLogic.layoutGaps;

	// Portrait stacks them below it, two abreast, so twice a readable panel.
	static widthForPanelsBelowMap = (LayoutLogic.minPanelWidth * 2) + LayoutLogic.layoutGaps;

	// A band is affordable when the page under it still has room to be worth showing.
	static heightForSelectorBand = LayoutLogic.topBarHeight + LayoutLogic.selectorBandHeight + LayoutLogic.minCampaignContentHeight;

	// Everything the top bar carries, side by side.
	static widthForBranding = LayoutLogic.brandingWidth + LayoutLogic.moneyWidth + LayoutLogic.topBarButtonsWidth + LayoutLogic.topBarSpacing;

	// The media queries that ask them. Layout holds the hooks, so it is the one place that asks.
	static queries = {
		landscape: '(orientation: landscape)',
		panelsBesideMap: `(min-width: ${LayoutLogic.widthForPanelsBesideMap}px)`,
		panelsBelowMap: `(min-width: ${LayoutLogic.widthForPanelsBelowMap}px)`,
		selectorBand: `(min-height: ${LayoutLogic.heightForSelectorBand}px)`,
		branding: `(min-width: ${LayoutLogic.widthForBranding}px)`
	};

	static getModel = (isLandscape: boolean, room: Omit<LayoutModel, 'orientation'>): LayoutModel => {
		// Which of the two panel questions decides it depends on where the panels would go, which
		// is what the orientation says.
		const isSmall = isLandscape ? !room.roomForPanelsBesideMap : !room.roomForPanelsBelowMap;

		return {
			orientation: OrientationLogic.getOrientation(isLandscape, isSmall),
			...room
		};
	};
}
