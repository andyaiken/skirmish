import { OrientationType } from '../../enums/orientation-type';

// How the screen is being held, and whether it's a phone-sized one.
//
// The two live in a single value because every screen already takes an orientation and writes it
// straight into its class name, so a phone arrives everywhere the orientation does without anything
// new being threaded through. The cost is that a small orientation is not equal to its full-sized
// counterpart, so nothing should compare one with === - use isPortrait and isLandscape below, or
// the screens that stack in portrait will lay themselves out for landscape on a phone.
export class OrientationLogic {
	static isPortrait = (orientation: OrientationType) => {
		return (orientation === OrientationType.Portrait) || (orientation === OrientationType.PortraitSmall);
	};

	static isLandscape = (orientation: OrientationType) => {
		return (orientation === OrientationType.Landscape) || (orientation === OrientationType.LandscapeSmall);
	};

	static isSmall = (orientation: OrientationType) => {
		return (orientation === OrientationType.PortraitSmall) || (orientation === OrientationType.LandscapeSmall);
	};

	// The class names a screen should carry. A small orientation carries both - 'portrait' so that
	// everything already written against the full-sized layout still applies, and 'portrait-small'
	// for the places that need to differ. Styling a phone is then a matter of adding rules rather
	// than repeating the ones that already work.
	static getClassName = (orientation: OrientationType) => {
		switch (orientation) {
			case OrientationType.PortraitSmall:
				return `${OrientationType.Portrait} ${OrientationType.PortraitSmall}`;
			case OrientationType.LandscapeSmall:
				return `${OrientationType.Landscape} ${OrientationType.LandscapeSmall}`;
			default:
				return orientation as string;
		}
	};

	// The two axes combined. What counts as small is LayoutLogic's question, not this one's.
	static getOrientation = (isLandscape: boolean, isSmall: boolean) => {
		if (isLandscape) {
			return isSmall ? OrientationType.LandscapeSmall : OrientationType.Landscape;
		}

		return isSmall ? OrientationType.PortraitSmall : OrientationType.Portrait;
	};
}
