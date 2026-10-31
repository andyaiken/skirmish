import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

export class Haptic {
	static enabled = true;

	static light = () => Haptic.run(() => Haptics.impact({ style: ImpactStyle.Light }));
	static heavy = () => Haptic.run(() => Haptics.impact({ style: ImpactStyle.Heavy }));
	static select = () => Haptic.run(() => Haptics.selectionChanged());
	static success = () => Haptic.run(() => Haptics.notification({ type: NotificationType.Success }));
	static warning = () => Haptic.run(() => Haptics.notification({ type: NotificationType.Warning }));
	static error = () => Haptic.run(() => Haptics.notification({ type: NotificationType.Error }));

	private static run = (fn: () => Promise<void>) => {
		if (Haptic.enabled && Capacitor.isNativePlatform()) {
			fn().catch(() => {
				// Error
			});
		}
	};
}
