import { afterEach, describe, expect, it, vi } from 'vitest';
import { Capacitor } from '@capacitor/core';

import { Platform } from './platform';

const runningAt = (hostname: string, native: boolean, debugBuild?: boolean) => {
	vi.stubGlobal('window', { location: { hostname: hostname }, skirmishDebugBuild: debugBuild });
	vi.spyOn(Capacitor, 'isNativePlatform').mockReturnValue(native);
};

describe('Platform.canUseDeveloperMode', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	it('is offered in a browser on the dev server', () => {
		runningAt('localhost', false);
		expect(Platform.canUseDeveloperMode()).toBe(true);
	});

	it('is not offered in a browser anywhere else', () => {
		runningAt('skirmish.example.com', false);
		expect(Platform.canUseDeveloperMode()).toBe(false);
	});

	it('is offered in a Debug build of the app, which flags itself', () => {
		runningAt('localhost', true, true);
		expect(Platform.canUseDeveloperMode()).toBe(true);
	});

	// The case the check exists for: a Release build - every archive, TestFlight and App Store
	// build - sets no flag, and serves its pages from capacitor://localhost, which a hostname
	// test alone would mistake for the dev server
	it('is never offered in a Release build of the app, even though its pages come from localhost', () => {
		runningAt('localhost', true);
		expect(Platform.canUseDeveloperMode()).toBe(false);
	});

	// The flag is a native-app signal; a browser that somehow has it set gets nothing from it
	it('ignores the Debug flag outside the app', () => {
		runningAt('skirmish.example.com', false, true);
		expect(Platform.canUseDeveloperMode()).toBe(false);
	});
});
