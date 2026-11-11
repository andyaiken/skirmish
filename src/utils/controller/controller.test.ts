import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Controller } from './controller';

// A controller with the given buttons (by standard-mapping index) held, and the left stick at x, y.
const pad = (pressed: number[] = [], x = 0, y = 0) => {
	return {
		buttons: Array.from({ length: 17 }, (_, n) => ({ pressed: pressed.includes(n), touched: false, value: 0 })),
		axes: [ x, y, 0, 0 ]
	} as unknown as Gamepad;
};

describe('Controller.getPressed', () => {
	it('reads nothing from a controller at rest', () => {
		expect([ ...Controller.getPressed([ pad() ]) ]).toEqual([]);
	});

	it('reads the D-pad, A, B and the shoulder buttons', () => {
		const pressed = Controller.getPressed([ pad([ 0, 1, 4, 5, 12, 15 ]) ]);
		expect([ ...pressed ].sort()).toEqual([ 'activate', 'back', 'nextTab', 'previousTab', 'right', 'up' ]);
	});

	it('reads the triggers', () => {
		const pressed = Controller.getPressed([ pad([ 6, 7 ]) ]);
		expect([ ...pressed ].sort()).toEqual([ 'zoomIn', 'zoomOut' ]);
	});

	it('ignores a stick pushed only a little way', () => {
		expect([ ...Controller.getPressed([ pad([], 0.3, -0.3) ]) ]).toEqual([]);
	});

	it('reads the stick as whichever way it is pushed furthest', () => {
		expect([ ...Controller.getPressed([ pad([], 0.9, 0.6) ]) ]).toEqual([ 'right' ]);
		expect([ ...Controller.getPressed([ pad([], -0.2, -0.8) ]) ]).toEqual([ 'up' ]);
	});

	it('combines more than one controller', () => {
		const pressed = Controller.getPressed([ pad([ 0 ]), pad([ 13 ]) ]);
		expect([ ...pressed ].sort()).toEqual([ 'activate', 'down' ]);
	});
});

describe('Controller.poll', () => {
	let pads: Gamepad[] = [];
	let press: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		pads = [];
		vi.spyOn(Controller, 'getPads').mockImplementation(() => pads);
		press = vi.spyOn(Controller, 'press').mockImplementation(() => {});
		Controller.stop();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('presses once when a button goes down, and not again while it is held', () => {
		pads = [ pad([ 0 ]) ];
		Controller.poll(0);
		Controller.poll(16);
		Controller.poll(1000);
		expect(press).toHaveBeenCalledTimes(1);
		expect(press).toHaveBeenCalledWith('activate');
	});

	it('presses again after the button is let go and pressed again', () => {
		pads = [ pad([ 0 ]) ];
		Controller.poll(0);
		pads = [ pad() ];
		Controller.poll(16);
		pads = [ pad([ 0 ]) ];
		Controller.poll(32);
		expect(press).toHaveBeenCalledTimes(2);
	});

	it('repeats a held direction after a pause', () => {
		pads = [ pad([ 13 ]) ];
		Controller.poll(0);
		Controller.poll(Controller.repeatDelay - 1);
		expect(press).toHaveBeenCalledTimes(1);

		Controller.poll(Controller.repeatDelay);
		expect(press).toHaveBeenCalledTimes(2);

		Controller.poll(Controller.repeatDelay + Controller.repeatInterval);
		expect(press).toHaveBeenCalledTimes(3);
		expect(press).toHaveBeenLastCalledWith('down');
	});
});
