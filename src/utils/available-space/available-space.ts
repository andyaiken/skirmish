import { useCallback, useSyncExternalStore } from 'react';

// How much room the app has to lay something out in, asked as a yes or no about one threshold.
//
// Not the size of the window. The webview runs edge to edge (viewport-fit=cover in index.html) and
// #root is inset from it by the safe area, so the space inside it can be a long way short of the
// viewport: on the largest iPhones held sideways the side insets come to 124pt, which is the
// difference between the encounter screen's roomy layout and a map squeezed to 242pt. A media
// query cannot ask about that, because env() is not allowed in one, so the element is measured.
//
// The answers are booleans rather than sizes so that a re-render happens only when a threshold is
// crossed - dragging a window edge without crossing one costs a measurement and nothing more. That
// is what useMediaQuery costs too, and these are deliberately the same shape as it.

// #root by id, as index.tsx mounts it and index.scss insets it; it is the element the safe area is
// taken out of, so it is the one that knows how much is left.
const getRoom = () => {
	const root = document.getElementById('root');
	if (!root) {
		// Nothing is mounted yet, so there is nothing to measure. The window is the closest thing
		// to the truth, and this is only ever read before the first paint.
		return { width: window.innerWidth, height: window.innerHeight };
	}

	// clientWidth and clientHeight are the padding box, and the padding is the inset.
	const style = getComputedStyle(root);

	return {
		width: root.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
		height: root.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)
	};
};

// Module-level so that it is the same function on every render and the store is not re-subscribed.
const subscribe = (onStoreChange: () => void) => {
	const root = document.getElementById('root');

	// A ResizeObserver catches the window being resized, the device being turned over, and the safe
	// area itself changing - an iPhone's side insets appear and disappear as it turns - and reports
	// all of them as one measurement, so the width and the height cannot disagree the way two
	// separate media queries can partway through a rotation. The resize listener is there for the
	// same reason it is in useMediaQuery: it costs nothing and it catches anything the observer
	// doesn't.
	const observer = new ResizeObserver(onStoreChange);
	if (root) {
		observer.observe(root);
	}
	window.addEventListener('resize', onStoreChange);

	return () => {
		observer.disconnect();
		window.removeEventListener('resize', onStoreChange);
	};
};

export const useWidthAtLeast = (px: number) => {
	const getSnapshot = useCallback(() => getRoom().width >= px, [ px ]);

	return useSyncExternalStore(subscribe, getSnapshot);
};

// The height is short by whatever strip the screen itself reserves for the home indicator, because
// #root doesn't carry that one (see index.scss) - so this answers against a little more height than
// a screen ends up with. The top inset, which is the larger of the two, is in the measurement.
export const useHeightAtLeast = (px: number) => {
	const getSnapshot = useCallback(() => getRoom().height >= px, [ px ]);

	return useSyncExternalStore(subscribe, getSnapshot);
};

// Which way up the space is, rather than which way up the device is. The two agree on every size
// that matters - no inset is anywhere near large enough to turn one into the other - but taking it
// from the same measurement as the others means a layout is never decided from a width and a height
// read at different moments.
export const useIsLandscape = () => {
	const getSnapshot = useCallback(() => {
		const room = getRoom();

		return room.width > room.height;
	}, []);

	return useSyncExternalStore(subscribe, getSnapshot);
};
