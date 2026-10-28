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
