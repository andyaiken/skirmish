// Puts a popover centred on whatever it is anchored to, which its stylesheet has already done, and
// then moves it back onto the screen if that would have put an edge of it off.
export const centrePopover = (element: HTMLElement | null, horizontal: boolean) => {
	if (!element) {
		return;
	}

	const centre = horizontal ? 'translateX(-50%)' : 'translateY(-50%)';
	element.style.transform = centre;

	const margin = 10;
	const rect = element.getBoundingClientRect();
	const start = horizontal ? rect.left : rect.top;
	const end = horizontal ? rect.right : rect.bottom;
	const limit = horizontal ? window.innerWidth : window.innerHeight;

	let shift = 0;
	if (start < margin) {
		shift = margin - start;
	} else if (end > limit - margin) {
		shift = (limit - margin) - end;
	}

	if (shift !== 0) {
		element.style.transform = `${centre} translate${horizontal ? 'X' : 'Y'}(${shift}px)`;
	}
};
