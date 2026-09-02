export interface OptionsModel {
	version: string;
	developer: boolean;
	showTips: boolean;
	// Turns off the decorative animations, which never stop and so keep a
	// tablet's screen and GPU busy even when nothing is happening
	reduceMotion: boolean;
	soundEffectsVolume: number;
	packIDs: string[];
	renderer: string;
}
