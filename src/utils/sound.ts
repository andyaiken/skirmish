interface SoundEffect {
	decoding: boolean;
	array: ArrayBuffer | null;
	audio: AudioBuffer | null;
}

export class Sound {
	static context: AudioContext | null = null;
	static volume = 0.5;

	static dong: SoundEffect = { decoding: false, array: null, audio: null };

	static play = (sound: SoundEffect) => {
		if (sound.decoding) {
			return;
		}

		try {
			if (!Sound.context) {
				Sound.context = new AudioContext();
			}

			if (sound.audio) {
				Sound.playDecoded(sound.audio);
			} else if (sound.array) {
				sound.decoding = true;
				Sound.context.decodeAudioData(sound.array, decoded => {
					sound.decoding = false;
					sound.array = null;
					sound.audio = decoded;
					Sound.playDecoded(sound.audio);
				}, () => {
					// Error
				});
			}
		} catch {
			// Error
		}
	};

	static playDecoded = (audio: AudioBuffer) => {
		if (!Sound.context) {
			return;
		}

		try {
			const gain = Sound.context.createGain();
			gain.gain.value = Sound.volume;

			const source = Sound.context.createBufferSource();
			source.buffer = audio;
			source.connect(gain).connect(Sound.context.destination);
			source.start();
		} catch {
			// Error
		}
	};
}
