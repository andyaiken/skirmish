import { AriaRole, KeyboardEvent } from 'react';

export class Keyboard {
	// Enter or Space on a focused element that is not a <button> acts as a click. The click is a
	// real one, dispatched on the element, so the element's own onClick handler runs unchanged.
	// Keys pressed on something inside it (a button in a card's footer, say) are left alone, or
	// pressing that button would click the card as well.
	static activate = (e: KeyboardEvent<Element>) => {
		if (e.target !== e.currentTarget) {
			return;
		}

		if ((e.key === 'Enter') || (e.key === ' ')) {
			e.preventDefault();
			e.currentTarget.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
		}
	};

	// Keeps Tab inside the given container, wrapping from the last control to the first and back,
	// for a dialog or anything else that covers the page: without it, Tab goes on to whatever is
	// behind. Call it from the container's keydown handler.
	static trapTab = (e: KeyboardEvent<Element>, container: HTMLElement | null) => {
		if ((e.key !== 'Tab') || !container) {
			return;
		}

		const focusable = Array.from(container.querySelectorAll<HTMLElement>(
			'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		)).filter(el => !(el as HTMLButtonElement).disabled && (el.getClientRects().length > 0));

		e.stopPropagation();

		if (focusable.length === 0) {
			e.preventDefault();
			return;
		}

		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		const active = document.activeElement;
		if (e.shiftKey && ((active === first) || (active === container))) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && (active === last)) {
			e.preventDefault();
			first.focus();
		}
	};

	// Props to spread onto a clickable element that is not a <button>, so it can be reached by Tab
	// (and later by a controller) and pressed with Enter or Space. Pass enabled = false when the
	// element would do nothing if clicked, so focus does not stop on it.
	static clickable = (enabled = true, role: AriaRole = 'button') => {
		if (!enabled) {
			return {};
		}

		return {
			role: role,
			tabIndex: 0,
			onKeyDown: Keyboard.activate
		};
	};
}
