import { describe, expect, it } from 'vitest';

import { OrientationType } from '../../enums/orientation-type';

import { OrientationLogic } from './orientation-logic';

describe('OrientationLogic', () => {
	describe('isPortrait', () => {
		it('is true for both portrait orientations', () => {
			expect(OrientationLogic.isPortrait(OrientationType.Portrait)).toEqual(true);
			expect(OrientationLogic.isPortrait(OrientationType.PortraitSmall)).toEqual(true);
		});

		it('is false for both landscape orientations', () => {
			expect(OrientationLogic.isPortrait(OrientationType.Landscape)).toEqual(false);
			expect(OrientationLogic.isPortrait(OrientationType.LandscapeSmall)).toEqual(false);
		});
	});

	describe('isLandscape', () => {
		it('is true for both landscape orientations', () => {
			expect(OrientationLogic.isLandscape(OrientationType.Landscape)).toEqual(true);
			expect(OrientationLogic.isLandscape(OrientationType.LandscapeSmall)).toEqual(true);
		});

		it('is false for both portrait orientations', () => {
			expect(OrientationLogic.isLandscape(OrientationType.Portrait)).toEqual(false);
			expect(OrientationLogic.isLandscape(OrientationType.PortraitSmall)).toEqual(false);
		});
	});

	describe('isSmall', () => {
		it('is true only for the small orientations', () => {
			expect(OrientationLogic.isSmall(OrientationType.PortraitSmall)).toEqual(true);
			expect(OrientationLogic.isSmall(OrientationType.LandscapeSmall)).toEqual(true);
			expect(OrientationLogic.isSmall(OrientationType.Portrait)).toEqual(false);
			expect(OrientationLogic.isSmall(OrientationType.Landscape)).toEqual(false);
		});
	});

	describe('getClassName', () => {
		it('gives a full-sized orientation its own name', () => {
			expect(OrientationLogic.getClassName(OrientationType.Portrait)).toEqual('portrait');
			expect(OrientationLogic.getClassName(OrientationType.Landscape)).toEqual('landscape');
		});

		// The point of the pair: rules already written against .portrait keep applying on a phone,
		// and .portrait-small is there for the ones that need to differ.
		it('gives a small orientation both its own name and the full-sized one', () => {
			expect(OrientationLogic.getClassName(OrientationType.PortraitSmall)).toEqual('portrait portrait-small');
			expect(OrientationLogic.getClassName(OrientationType.LandscapeSmall)).toEqual('landscape landscape-small');
		});
	});

	describe('getOrientation', () => {
		it('combines the two axes', () => {
			expect(OrientationLogic.getOrientation(false, false)).toEqual(OrientationType.Portrait);
			expect(OrientationLogic.getOrientation(false, true)).toEqual(OrientationType.PortraitSmall);
			expect(OrientationLogic.getOrientation(true, false)).toEqual(OrientationType.Landscape);
			expect(OrientationLogic.getOrientation(true, true)).toEqual(OrientationType.LandscapeSmall);
		});
	});

});
