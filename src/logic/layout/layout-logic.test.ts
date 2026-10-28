import { describe, expect, it } from 'vitest';

import { OrientationType } from '../../enums/orientation-type';

import { LayoutLogic } from './layout-logic';

// The questions are asked of a real viewport in the app, so the tests ask them of real shapes.
const modelFor = (width: number, height: number) => {
	const isLandscape = width > height;

	return LayoutLogic.getModel(isLandscape, {
		roomForPanelsBesideMap: width >= LayoutLogic.widthForPanelsBesideMap,
		roomForPanelsBelowMap: width >= LayoutLogic.widthForPanelsBelowMap,
		roomForSelectorBand: height >= LayoutLogic.heightForSelectorBand,
		roomForSelectorColumns: width >= LayoutLogic.widthForSelectorColumns,
		roomForBranding: width >= LayoutLogic.widthForBranding
	});
};

describe('LayoutLogic', () => {
	describe('the thresholds', () => {
		// Each is a sum of the sizes of things the game draws, so the test states the sum.
		it('adds up from what the game draws', () => {
			expect(LayoutLogic.widthForPanelsBesideMap).toEqual(930);
			expect(LayoutLogic.widthForPanelsBelowMap).toEqual(500);
			expect(LayoutLogic.heightForSelectorBand).toEqual(587);
			expect(LayoutLogic.widthForBranding).toEqual(473);
			expect(LayoutLogic.widthForSelectorColumns).toEqual(350);
			expect(LayoutLogic.minShortEdge).toEqual(305);
			expect(LayoutLogic.minLongEdge).toEqual(497);
		});
	});

	// The gate's job is to turn away a screen nothing can be laid out in, and nothing else.
	describe('the smallest screen it will play on', () => {
		const fits = (width: number, height: number) => {
			return (Math.min(width, height) >= LayoutLogic.minShortEdge) && (Math.max(width, height) >= LayoutLogic.minLongEdge);
		};

		it('lets every iPhone in, either way up', () => {
			// The smallest there is, and the one the old floor shut out.
			expect(fits(320, 568)).toEqual(true);
			expect(fits(568, 320)).toEqual(true);
			expect(fits(375, 667)).toEqual(true);
			expect(fits(402, 874)).toEqual(true);
			expect(fits(440, 956)).toEqual(true);
		});

		it('lets a tablet and a folding phone in, either way up', () => {
			expect(fits(768, 1024)).toEqual(true);
			expect(fits(1024, 768)).toEqual(true);
			expect(fits(744, 1133)).toEqual(true);
			// Both of the opened states the old pair of rectangles turned away.
			expect(fits(890, 626)).toEqual(true);
			expect(fits(626, 890)).toEqual(true);
		});

		it('turns away a window nothing fits in', () => {
			// Too narrow for a readable panel over the map.
			expect(fits(300, 900)).toEqual(false);
			// Room across, but the campaign screen has nowhere to put the island and its panel.
			expect(fits(320, 480)).toEqual(false);
			expect(fits(400, 400)).toEqual(false);
		});
	});

	describe('orientation', () => {
		it('calls a phone small whichever way up it is', () => {
			expect(modelFor(402, 874).orientation).toEqual(OrientationType.PortraitSmall);
			expect(modelFor(874, 402).orientation).toEqual(OrientationType.LandscapeSmall);
			expect(modelFor(375, 667).orientation).toEqual(OrientationType.PortraitSmall);
		});

		it('leaves a tablet alone', () => {
			expect(modelFor(1024, 768).orientation).toEqual(OrientationType.Landscape);
			expect(modelFor(768, 1024).orientation).toEqual(OrientationType.Portrait);
			expect(modelFor(1133, 744).orientation).toEqual(OrientationType.Landscape);
		});

		// Not phones, and a rule about phones read them wrong.
		it('calls a wide screen small when the map would be squeezed', () => {
			expect(modelFor(890, 626).orientation).toEqual(OrientationType.LandscapeSmall);
			expect(modelFor(626, 890).orientation).toEqual(OrientationType.Portrait);
			expect(modelFor(320, 1024).orientation).toEqual(OrientationType.PortraitSmall);
			expect(modelFor(800, 700).orientation).toEqual(OrientationType.LandscapeSmall);
		});
	});

	// The reason each question is asked separately: they disagree, and on different axes.
	describe('the questions disagree', () => {
		// Short and wide. There is width for the panels, so it is not small - but no height to
		// spend on a band, which is the selector's question and not the panels'. A single size
		// class answered this one wrong whichever way it was defined.
		it('is roomy for panels and cramped for a band at 1200x400', () => {
			const layout = modelFor(1200, 400);

			expect(layout.orientation).toEqual(OrientationType.Landscape);
			expect(layout.roomForPanelsBesideMap).toEqual(true);
			expect(layout.roomForSelectorBand).toEqual(false);
		});

		// A folding phone opened out is the mirror image: squeezed for the map, roomy for a band.
		it('is cramped for panels and roomy for a band at 890x626', () => {
			const layout = modelFor(890, 626);

			expect(layout.orientation).toEqual(OrientationType.LandscapeSmall);
			expect(layout.roomForPanelsBesideMap).toEqual(false);
			expect(layout.roomForSelectorBand).toEqual(true);
		});

		// Branding is a width question, so it survives being turned sideways.
		it('keeps the branding sideways on a phone and drops it upright', () => {
			expect(modelFor(874, 402).roomForBranding).toEqual(true);
			expect(modelFor(402, 874).roomForBranding).toEqual(false);
		});
	});
});
