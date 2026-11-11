import { Direction, Navigation } from '../navigation/navigation';

type ControllerButton = Direction | 'activate' | 'back' | 'previousTab' | 'nextTab' | 'zoomOut' | 'zoomIn';

// Reads a game controller and turns it into the same moves the keyboard makes: the D-pad and the
// left stick move focus, A presses, B backs out, the shoulder buttons step through tabs, and the
// triggers zoom whatever can be zoomed (they send + and -, as the keyboard would).
//
// The Gamepad API has no events for button presses, only a snapshot to be read, so while a
// controller is connected this reads it once a frame. Nothing runs while none is: a browser
// reports a controller as connected only once a button on it has been pressed, and that press
// is what starts the loop.
export class Controller {
	// Buttons in the browser's standard mapping, which is the layout of an Xbox controller; a
	// PlayStation or MFi controller is presented the same way.
	static buttons: Record<number, ControllerButton> = {
		0: 'activate',
		1: 'back',
		4: 'previousTab',
		5: 'nextTab',
		6: 'zoomOut',
		7: 'zoomIn',
		12: 'up',
		13: 'down',
		14: 'left',
		15: 'right'
	};

	// How far the stick has to be pushed before it counts as a direction.
	static stickThreshold = 0.5;

	// Holding a direction moves once, then after a pause keeps moving, as a held key does.
	static repeatDelay = 400;
	static repeatInterval = 120;

	private static held = new Map<ControllerButton, number>();
	private static frame: number | null = null;

	static install = () => {
		window.addEventListener('gamepadconnected', Controller.start);
		window.addEventListener('gamepaddisconnected', () => {
			if (!Controller.getPads().length) {
				Controller.stop();
			}
		});

		// A mouse or a finger takes over from the controller, so the focus ring goes away as it
		// would after a click.
		window.addEventListener('pointerdown', () => {
			delete document.documentElement.dataset.input;
		}, true);

		// One may already be connected, after a reload.
		if (Controller.getPads().length) {
			Controller.start();
		}
	};

	static getPads = () => {
		return navigator.getGamepads ? navigator.getGamepads().filter(p => !!p) : [];
	};

	static start = () => {
		if (Controller.frame === null) {
			Controller.frame = requestAnimationFrame(Controller.tick);
		}
	};

	static stop = () => {
		if (Controller.frame !== null) {
			cancelAnimationFrame(Controller.frame);
			Controller.frame = null;
		}
		Controller.held.clear();
	};

	static tick = (now: number) => {
		Controller.poll(now);
		Controller.frame = requestAnimationFrame(Controller.tick);
	};

	// Which of the buttons this reads are down on any connected controller just now.
	static getPressed = (pads: Gamepad[]) => {
		const pressed = new Set<ControllerButton>();

		pads.forEach(pad => {
			Object.entries(Controller.buttons).forEach(([ index, button ]) => {
				if (pad.buttons[Number(index)]?.pressed) {
					pressed.add(button);
				}
			});

			// The left stick, read as whichever direction it is pushed furthest in.
			const x = pad.axes[0] ?? 0;
			const y = pad.axes[1] ?? 0;
			if (Math.max(Math.abs(x), Math.abs(y)) >= Controller.stickThreshold) {
				if (Math.abs(x) > Math.abs(y)) {
					pressed.add(x > 0 ? 'right' : 'left');
				} else {
					pressed.add(y > 0 ? 'down' : 'up');
				}
			}
		});

		return pressed;
	};

	// Public, with the time passed in, so it can be driven without waiting on animation frames.
	static poll = (now: number) => {
		const pressed = Controller.getPressed(Controller.getPads());

		Controller.held.forEach((_, button) => {
			if (!pressed.has(button)) {
				Controller.held.delete(button);
			}
		});

		pressed.forEach(button => {
			const next = Controller.held.get(button);
			if (next === undefined) {
				Controller.held.set(button, now + Controller.repeatDelay);
				Controller.press(button);
			} else if (Controller.isDirection(button) && (now >= next)) {
				// Only directions repeat: holding A should not press a button over and over.
				Controller.held.set(button, now + Controller.repeatInterval);
				Controller.press(button);
			}
		});
	};

	static isDirection = (button: ControllerButton): button is Direction => {
		return (button === 'up') || (button === 'down') || (button === 'left') || (button === 'right');
	};

	static press = (button: ControllerButton) => {
		// Focus moved by script does not count as keyboard focus, so the browser would not draw
		// the ring for it; this says the controller is in use, and index.scss draws it instead.
		document.documentElement.dataset.input = 'controller';
		Navigation.usingKeys = true;
		Navigation.rememberFocus();

		switch (button) {
			case 'activate':
				Navigation.activate();
				break;
			case 'back':
				Navigation.back();
				break;
			case 'previousTab':
				Navigation.cycleTabs(-1);
				break;
			case 'nextTab':
				Navigation.cycleTabs(1);
				break;
			case 'zoomOut':
				Navigation.sendKey('-');
				break;
			case 'zoomIn':
				Navigation.sendKey('+');
				break;
			default:
				if (!Controller.adjustSlider(button)) {
					Navigation.move(button);
				}
				break;
		}
	};

	// Left and right on a slider move the slider, as the arrow keys do, rather than leaving it.
	// stepUp and stepDown change the value without going through the value setter React watches,
	// so the input event that follows is seen as a change and reaches the slider's onChange.
	static adjustSlider = (dir: Direction) => {
		const el = document.activeElement;
		if (!(el instanceof HTMLInputElement) || (el.type !== 'range') || ((dir !== 'left') && (dir !== 'right'))) {
			return false;
		}

		if (dir === 'right') {
			el.stepUp();
		} else {
			el.stepDown();
		}
		el.dispatchEvent(new Event('input', { bubbles: true }));
		return true;
	};
}
