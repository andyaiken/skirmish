import type { LayoutModel } from '../../models/layout';

import { OrientationLogic } from '../orientation/orientation-logic';

// The questions a screen can ask about the space it has, and the sizes the answers come from.
//
// Every number here is the size of something the game actually draws, and every threshold is a sum
// of those sizes. None of them is a device's dimensions, which is the point: a threshold picked
// from a phone's width is right until something arrives that is not a phone, and then it is wrong
// in a way that no amount of adjusting it fixes. Change what the game draws and these follow.
export class LayoutLogic {
	// Apple's floor for anything you tap, and what index.scss gives every button. It is here
	// because the sums below are made of buttons, so raising it has to move them with it.
	static minTouchTarget = 44;

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

	// The encounter screen's own padding, left and right, and the strip of map a sheet leaves
	// uncovered beside it so that it reads as something laid over the board.
	static screenPadding = 20;
	static sheetMapStrip = 50;

	// --- the campaign screen's page selector ---

	static topBarHeight = 60;

	// The selector as a band across the top: its options plus its margins.
	static selectorBandHeight = 77;

	// What the page below it needs to be worth showing.
	static minCampaignContentHeight = 450;

	// --- the campaign screen's page selector, across ---
	//
	// The four labels at their narrowest, which is each one's longest word and the padding around
	// it. Measured from the band that didn't fit at 320: 330 of columns in 294 of selector, which
	// is what pushed Equipment off the edge. Two long labels and two short ones.

	static selectorLongLabel = 100;
	static selectorShortLabel = 65;
	static selectorMargins = 20;

	// --- the campaign screen's top bar ---
	//
	// Measured from the bar that did not fit: 467px of content on a 390px screen, which is where
	// the help button went over the edge.

	static brandingWidth = 175;
	static moneyWidth = 90;
	// The packs button and the help button, with the gap between them.
	static topBarButtonsWidth = (LayoutLogic.minTouchTarget * 2) + 15;
	static topBarSpacing = 105;

	// --- the smallest screen the game can be played on ---
	//
	// Measured rather than chosen: every one of these is a size below which something the game
	// needs stops being there, not merely gets tight. A screen that is only cramped is one the
	// player may still want to play on.

	// The island map's floor on the campaign screen, below which a region is smaller than a
	// fingertip, and the least the panel under it can show and still be worth scrolling.
	static minIslandMapHeight = 200;
	static minCampaignPanelHeight = 100;

	// The selector wraps its labels to two rows on a narrow screen, which is the case that matters
	// here; 77 is the one-row height.
	static selectorBandHeightWrapped = 97;

	// --- the thresholds those sizes add up to ---

	// Landscape puts the panels beside the map, so the map's floor plus both panels.
	static widthForPanelsBesideMap = LayoutLogic.minMapWidth + LayoutLogic.panelWidths + LayoutLogic.layoutGaps;

	// Portrait stacks them below it, two abreast, so twice a readable panel.
	static widthForPanelsBelowMap = (LayoutLogic.minPanelWidth * 2) + LayoutLogic.layoutGaps;

	// A band is affordable when the page under it still has room to be worth showing.
	static heightForSelectorBand = LayoutLogic.topBarHeight + LayoutLogic.selectorBandHeight + LayoutLogic.minCampaignContentHeight;

	// Everything the top bar carries, side by side.
	static widthForBranding = LayoutLogic.brandingWidth + LayoutLogic.moneyWidth + LayoutLogic.topBarButtonsWidth + LayoutLogic.topBarSpacing;

	// All four of the selector's labels across, rather than two rows of two.
	static widthForSelectorColumns = (LayoutLogic.selectorLongLabel * 2) + (LayoutLogic.selectorShortLabel * 2) + LayoutLogic.selectorMargins;

	// A panel over the map at the width this file calls readable, the strip of map it leaves beside
	// it, and the screen's padding either side. Below this a panel is narrower than it can be read
	// at, and the encounter screen has nowhere left to put one. Measured: at 280 the panels are
	// 210, at 320 they are 250.
	static minShortEdge = LayoutLogic.minPanelWidth + LayoutLogic.sheetMapStrip + LayoutLogic.screenPadding;

	// The campaign screen runs out of height first, and it is the screen an encounter is started
	// from: its top bar, its selector wrapped to two rows, the island map's floor and a panel below
	// it with something in it, plus the gaps and padding between them. Measured: at 500 the panel
	// has 93 and scrolls, at 440 it is down to two lines and the page is being clipped.
	static minLongEdge = LayoutLogic.topBarHeight
		+ LayoutLogic.selectorBandHeightWrapped
		+ LayoutLogic.minIslandMapHeight
		+ LayoutLogic.minCampaignPanelHeight
		+ LayoutLogic.layoutGaps
		+ 10;

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
