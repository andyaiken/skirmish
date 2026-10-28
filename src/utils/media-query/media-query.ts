import { useCallback, useSyncExternalStore } from 'react';

// Whether a media query matches, kept up to date as the window changes.
//
// This stands in for react-responsive's hook of the same name, which listens only for the query's
// own change event. That fires when a device is turned over, but not dependably when a window is
// resized - and the Mac build's window is resizable, as is a browser's while developing - so a
// resize is listened for as well and the query read again each time.
//
// Reading on every resize is cheap because useSyncExternalStore re-renders only when the answer
// actually changes: dragging a window edge without crossing the query's threshold costs a read and
// nothing more.
export const useMediaQuery = (query: string) => {
	const subscribe = useCallback((onStoreChange: () => void) => {
		const list = window.matchMedia(query);

		list.addEventListener('change', onStoreChange);
		window.addEventListener('resize', onStoreChange);

		return () => {
			list.removeEventListener('change', onStoreChange);
			window.removeEventListener('resize', onStoreChange);
		};
	}, [ query ]);

	const getSnapshot = useCallback(() => window.matchMedia(query).matches, [ query ]);

	return useSyncExternalStore(subscribe, getSnapshot);
};
