import { OrientationType } from '../enums/orientation-type';

// What a screen is told about the space it has been given.
//
// Each flag is the answer to one question about room for one particular thing, asked where that
// thing's size is known. A screen reads the one or two it cares about, rather than being handed a
// size and left to invent a threshold, or handed someone else's answer and left to hope it fits.
//
// The answers rather than the dimensions, because a flag only changes when a threshold is crossed:
// handing down the width would re-render every screen on every frame of a window drag, and the
// campaign map alone is a thousand elements.
export interface LayoutModel {
	// Which way up, and whether there is room to lay the game out the roomy way.
	orientation: OrientationType;

	// Room for the encounter screen's two panels beside the map, and below it.
	roomForPanelsBesideMap: boolean;
	roomForPanelsBelowMap: boolean;

	// Room to spend a band of height on the campaign screen's page selector.
	roomForSelectorBand: boolean;

	// Room for the campaign screen's top bar to carry its branding as well as everything else.
	roomForBranding: boolean;
}
