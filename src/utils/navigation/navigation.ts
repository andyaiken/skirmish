export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Rect {
	left: number;
	top: number;
	right: number;
	bottom: number;
}

// Moves focus around the screen by direction rather than by document order, which is what the
// arrow keys and a controller's D-pad need: "the thing to the right of this one", not "the next
// thing in the page". Tab still goes through the document in order, as it always has.
export class Navigation {
	static focusableSelector = 'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

	// How far a candidate may sit back across the line before it stops counting as being in that
	// direction at all. Without a little slack, two buttons in a row whose edges touch, or overlap
	// by a border, would not count as beside each other.
	static tolerance = 4;

	// Whether the keyboard or a controller is what is being used, rather than touch or a mouse.
	// Focus is only put back after it has been lost (see recoverFocus) while it is.
	static usingKeys = false;

	// Where whatever last had focus was, so that when it vanishes - a press that replaces the
	// part of the screen it was in - focus can go to whatever is now nearest that spot.
	static lastRect: Rect | null = null;

	// Picks which of the candidates is the best one to move to from the current rect, going in
	// the given direction, or returns -1 if none of them is in that direction.
	//
	// A candidate that lines up with the current one - their extents across the direction overlap,
	// so it is in the beam you would see shining that way - always wins over one that does not,
	// however much nearer that one is. That is what keeps moving down a column of cards in the
	// column rather than stepping into the next column over whenever its card is a little higher.
	// Only when nothing lines up does it go diagonally, and then distance across the direction
	// counts for more than distance along it.
	static findBest = (from: Rect, candidates: Rect[], dir: Direction) => {
		let best = -1;
		let bestInBeam = false;
		let bestScore = Number.MAX_VALUE;

		const fromCentreX = (from.left + from.right) / 2;
		const fromCentreY = (from.top + from.bottom) / 2;

		candidates.forEach((to, index) => {
			const toCentreX = (to.left + to.right) / 2;
			const toCentreY = (to.top + to.bottom) / 2;

			let along = 0;
			let across = 0;
			let offset = 0;
			switch (dir) {
				case 'up':
					if ((to.bottom > from.top + Navigation.tolerance) || (toCentreY >= fromCentreY)) {
						return;
					}
					along = Math.max(0, from.top - to.bottom);
					across = Math.max(0, to.left - from.right, from.left - to.right);
					offset = Math.abs(toCentreX - fromCentreX);
					break;
				case 'down':
					if ((to.top < from.bottom - Navigation.tolerance) || (toCentreY <= fromCentreY)) {
						return;
					}
					along = Math.max(0, to.top - from.bottom);
					across = Math.max(0, to.left - from.right, from.left - to.right);
					offset = Math.abs(toCentreX - fromCentreX);
					break;
				case 'left':
					if ((to.right > from.left + Navigation.tolerance) || (toCentreX >= fromCentreX)) {
						return;
					}
					along = Math.max(0, from.left - to.right);
					across = Math.max(0, to.top - from.bottom, from.top - to.bottom);
					offset = Math.abs(toCentreY - fromCentreY);
					break;
				case 'right':
					if ((to.left < from.right - Navigation.tolerance) || (toCentreX <= fromCentreX)) {
						return;
					}
					along = Math.max(0, to.left - from.right);
					across = Math.max(0, to.top - from.bottom, from.top - to.bottom);
					offset = Math.abs(toCentreY - fromCentreY);
					break;
			}

			// The small weight on the centre offset only settles ties between candidates which
			// are equally far away and equally in line - the item in a row nearest to straight
			// ahead, rather than whichever came first in the page.
			const inBeam = across === 0;
			const score = along + (across * 3) + (offset * 0.1);
			if ((inBeam && !bestInBeam) || ((inBeam === bestInBeam) && (score < bestScore))) {
				bestInBeam = inBeam;
				bestScore = score;
				best = index;
			}
		});

		return best;
	};

	// For a group of small things scattered about, rather than laid out in rows and columns -
	// the region labels on the island map. Lining up does not mean much when nothing does, so
	// this goes by the centres: the nearest one roughly in that direction (within 45 degrees
	// either side of it), counting sideways distance double. If there is nothing in that
	// cone, it returns -1, and the caller falls back to findBest: at the edge of the map, that is
	// how focus leaves it for the panel beside it.
	static findNearest = (from: Rect, candidates: Rect[], dir: Direction) => {
		let best = -1;
		let bestScore = Number.MAX_VALUE;

		const fromX = (from.left + from.right) / 2;
		const fromY = (from.top + from.bottom) / 2;

		candidates.forEach((to, index) => {
			const dx = ((to.left + to.right) / 2) - fromX;
			const dy = ((to.top + to.bottom) / 2) - fromY;

			let along = 0;
			let across = 0;
			switch (dir) {
				case 'up':
					along = -dy;
					across = Math.abs(dx);
					break;
				case 'down':
					along = dy;
					across = Math.abs(dx);
					break;
				case 'left':
					along = -dx;
					across = Math.abs(dy);
					break;
				case 'right':
					along = dx;
					across = Math.abs(dy);
					break;
			}

			if ((along <= 0) || (across > along)) {
				return;
			}

			const score = along + (across * 2);
			if (score < bestScore) {
				bestScore = score;
				best = index;
			}
		});

		return best;
	};

	// Which of the candidates has its centre nearest to the centre of the given rect, in any
	// direction, or -1 if there are none.
	static findClosest = (from: Rect, candidates: Rect[]) => {
		const fromX = (from.left + from.right) / 2;
		const fromY = (from.top + from.bottom) / 2;

		let best = -1;
		let bestDistance = Number.MAX_VALUE;
		candidates.forEach((to, index) => {
			const distance = Math.hypot(((to.left + to.right) / 2) - fromX, ((to.top + to.bottom) / 2) - fromY);
			if (distance < bestDistance) {
				bestDistance = distance;
				best = index;
			}
		});

		return best;
	};

	// Where focus can go just now: the open dialog if there is one (a dialog keeps focus inside
	// itself, so leaving it by arrow would be a way out of the trap), otherwise the whole app.
	static getScope = (): Element => {
		const preview = document.querySelector('.card-preview-backdrop');
		if (preview) {
			return preview;
		}

		const active = document.activeElement;
		const activeDialog = active ? active.closest('.dialog') : null;
		if (activeDialog) {
			return activeDialog;
		}

		const dialogs = Array.from(document.querySelectorAll('.dialog'));
		if (dialogs.length > 0) {
			// The highest level is the one on top; of two at the same level, the later one.
			const level = (d: Element) => {
				const match = /level-(\d+)/.exec(d.className);
				return match ? parseInt(match[1]) : 1;
			};
			return dialogs.reduce((top, d) => level(d) >= level(top) ? d : top);
		}

		return document.body;
	};

	static getCandidates = (scope: Element) => {
		return Array.from(scope.querySelectorAll<HTMLElement>(Navigation.focusableSelector))
			.filter(el => {
				if ((el as HTMLButtonElement).disabled || el.closest('[inert], [aria-hidden="true"]')) {
					return false;
				}

				// Something with no size is not on screen in any way that counts: a collapsed
				// panel, or a control in a closed flyout.
				const rect = el.getBoundingClientRect();
				if ((rect.width === 0) || (rect.height === 0)) {
					return false;
				}

				return getComputedStyle(el).visibility !== 'hidden';
			});
	};

	// Arrow keys over a text field or a slider are for the field, not for moving between controls.
	// A slider only uses left and right, so up and down still move on from one.
	static ownsArrows = (el: Element | null, dir: Direction) => {
		if (!el) {
			return false;
		}

		if ((el instanceof HTMLTextAreaElement) || (el instanceof HTMLSelectElement)) {
			return true;
		}

		if (el instanceof HTMLInputElement) {
			if (el.type === 'range') {
				return (dir === 'left') || (dir === 'right');
			}
			return true;
		}

		return false;
	};

	// Returns true if focus moved, so that the caller knows whether the key press was used.
	static move = (dir: Direction) => {
		const scope = Navigation.getScope();
		const candidates = Navigation.getCandidates(scope);
		if (candidates.length === 0) {
			return false;
		}

		const active = document.activeElement as HTMLElement | null;
		const current = active && candidates.includes(active) ? active : null;

		if (!current) {
			// Nothing in reach has focus yet - the page has just opened, or a dialog has, and
			// holds focus itself. Start at the first control rather than guessing a direction
			// from something that is not one. A dialog's close button comes first in the page
			// but is not where anyone wants to start, as pressing it throws the dialog away.
			const first = candidates.find(c => !c.classList.contains('close-btn')) ?? candidates[0];
			first.focus();
			return true;
		}

		const others = candidates.filter(c => c !== current);

		// Inside a group marked with data-nav-group (the island map), moving stays in the group
		// while there is anything roughly in that direction, and goes by findNearest. Otherwise the
		// big panel beside the map is always more nearly in line than the next label is, and focus
		// would leave the map at every step. At the edge of the group it leaves as usual.
		const group = current.closest('[data-nav-group]');
		if (group) {
			const members = others.filter(c => group.contains(c));
			const nearest = Navigation.findNearest(current.getBoundingClientRect(), members.map(c => c.getBoundingClientRect()), dir);
			if (nearest !== -1) {
				members[nearest].focus();
				return true;
			}
		}

		// Inside something that scrolls - the hand of action cards, a long list in a sidebar -
		// moving goes on to the next thing in it while there is one, scrolling it into view as it
		// takes focus, rather than leaving for something outside that happens to be nearer the
		// edge than the next item, which is out of sight beyond it.
		const scroller = Navigation.getScrollContainer(current);
		if (scroller) {
			const members = others.filter(c => scroller.contains(c));
			const next = Navigation.findBest(current.getBoundingClientRect(), members.map(c => c.getBoundingClientRect()), dir);
			if (next !== -1) {
				members[next].focus();
				return true;
			}
		}

		const index = Navigation.findBest(current.getBoundingClientRect(), others.map(c => c.getBoundingClientRect()), dir);
		if (index === -1) {
			return false;
		}

		others[index].focus();
		return true;
	};

	// The nearest element around this one which scrolls and has something to scroll, if any.
	static getScrollContainer = (el: Element) => {
		let parent = el.parentElement;
		while (parent && (parent !== document.body)) {
			const style = getComputedStyle(parent);
			const scrollsX = /(auto|scroll)/.test(style.overflowX) && (parent.scrollWidth > parent.clientWidth + 1);
			const scrollsY = /(auto|scroll)/.test(style.overflowY) && (parent.scrollHeight > parent.clientHeight + 1);
			if (scrollsX || scrollsY) {
				return parent;
			}
			parent = parent.parentElement;
		}

		return null;
	};

	// Presses whatever has focus, as a tap would.
	static activate = () => {
		const active = document.activeElement;
		if (!active || (active === document.body)) {
			return;
		}

		if (active instanceof HTMLElement) {
			active.click();
		} else {
			active.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
		}
	};

	// Backs out of whatever is open, as Escape does: a card preview, then a dialog.
	static back = () => {
		Navigation.sendKey('Escape');
	};

	// Sends a key press from whatever has focus, for a controller button that does what a key
	// does. Sent from inside whatever is open, as that is where it listens; if focus has been
	// lost to the page, from the open dialog itself.
	static sendKey = (key: string) => {
		const scope = Navigation.getScope();
		const active = document.activeElement;
		const target = active && scope.contains(active) ? active : scope;
		target.dispatchEvent(new KeyboardEvent('keydown', { key: key, bubbles: true, cancelable: true }));
	};

	// Moves to the previous or next tab of the set of tabs in reach - the shoulder buttons on a
	// controller - so that a tabbed dialog does not need the D-pad taken all the way to the top.
	static cycleTabs = (delta: number) => {
		const scope = Navigation.getScope();
		const tablist = scope.querySelector('[role="tablist"]');
		if (!tablist) {
			return;
		}

		const tabs = Array.from(tablist.querySelectorAll<HTMLElement>('[role="tab"]'));
		if (tabs.length === 0) {
			return;
		}

		const selected = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
		const next = tabs[(selected + delta + tabs.length) % tabs.length];
		next.click();
		next.focus();
	};

	static onKeyDown = (e: KeyboardEvent) => {
		if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
			return;
		}

		let dir: Direction | null = null;
		switch (e.key) {
			case 'ArrowUp':
				dir = 'up';
				break;
			case 'ArrowDown':
				dir = 'down';
				break;
			case 'ArrowLeft':
				dir = 'left';
				break;
			case 'ArrowRight':
				dir = 'right';
				break;
		}

		if (!dir || Navigation.ownsArrows(document.activeElement, dir)) {
			return;
		}

		// Only claimed if focus moved, so a scrolling container still scrolls with the arrows
		// when there is nowhere further to go.
		if (Navigation.move(dir)) {
			e.preventDefault();
		}
	};

	// Notes where the element with focus is. Called when it takes focus, and again just before
	// every key or controller press is acted on: focus scrolls an element into view smoothly, so
	// where it was as it took focus is not where it ends up, and it is the press that removes it.
	static rememberFocus = () => {
		const active = document.activeElement;
		if (active && (active !== document.body) && active.isConnected) {
			const rect = active.getBoundingClientRect();
			Navigation.lastRect = { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
		}
	};

	// When the element with focus is taken out of the page, or disabled - a button for an action
	// that has just been used - the browser drops focus on the page itself, and the next arrow
	// press starts again from the first control on the screen. This is called whenever elements
	// are removed or focus leaves for nowhere, and if focus is on the page, it puts it on whatever
	// is now nearest to where the lost element was - typically the first thing in the panel that
	// has just replaced it. Text fields are skipped: focusing one would bring up the on-screen
	// keyboard, which nobody asked for.
	static recoverFocus = () => {
		if (!Navigation.usingKeys || !Navigation.lastRect) {
			return;
		}

		const active = document.activeElement;
		if (active && (active !== document.body)) {
			return;
		}

		const candidates = Navigation.getCandidates(Navigation.getScope())
			.filter(c => !(c instanceof HTMLTextAreaElement) && !((c instanceof HTMLInputElement) && (c.type !== 'range')));
		const index = Navigation.findClosest(Navigation.lastRect, candidates.map(c => c.getBoundingClientRect()));
		if (index !== -1) {
			candidates[index].focus({ preventScroll: true });
		}
	};

	static install = () => {
		// Captured, so the note of where focus is is taken before anything handles the key.
		document.addEventListener('keydown', () => {
			Navigation.usingKeys = true;
			Navigation.rememberFocus();
		}, true);
		document.addEventListener('keydown', Navigation.onKeyDown);
		window.addEventListener('pointerdown', () => {
			Navigation.usingKeys = false;
		}, true);
		document.addEventListener('focusin', Navigation.rememberFocus);

		// Focus leaving for nowhere (relatedTarget is null) is checked once whatever caused it has
		// finished, as by then it may have gone somewhere after all.
		document.addEventListener('focusout', e => {
			if (!e.relatedTarget) {
				setTimeout(Navigation.recoverFocus, 0);
			}
		});

		// Only additions and removals of elements are watched - not attributes or text, which
		// change constantly during an encounter - and the check itself is cheap when nothing has
		// been lost, which is nearly always.
		new MutationObserver(Navigation.recoverFocus).observe(document.body, { childList: true, subtree: true });
	};
}
