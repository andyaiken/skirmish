interface SoundEffect {
	decoding: boolean;
	array: ArrayBuffer | null;
	audio: AudioBuffer | null;
}

export class Sound {
	static context: AudioContext | null = null;
	static volume = 0.5;

	// An audio context keeps a thread running - and drawing power - for as long
	// as it is active, even in silence, which adds up over a long session on a
	// tablet. The context is suspended once the game has been quiet for a few
	// seconds, and woken again for the next sound. Waiting for quiet, rather
	// than suspending the moment a sound ends, avoids winding the audio thread
	// down and straight back up between two sounds in quick succession.
	static suspendTimeout: ReturnType<typeof setTimeout> | null = null;
	static suspendDelay = 3 * 1000;

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
			const context = Sound.context;
			Sound.stayAwake();

			const start = () => {
				const gain = context.createGain();
				gain.gain.value = Sound.volume;

				const source = context.createBufferSource();
				source.buffer = audio;
				source.connect(gain).connect(context.destination);
				source.addEventListener('ended', Sound.sleepWhenQuiet);
				source.start();
			};

			// A suspended context's clock doesn't run, and a sound started on it
			// is never heard, so wake it up and play only once it's awake. If it
			// refuses to wake, play anyway: no worse than never suspending it.
			if (context.state === 'running') {
				start();
			} else {
				context.resume().then(start, start);
			}
		} catch {
			// Error
		}
	};

	// Cancel any pending suspend; the context is about to be needed
	static stayAwake = () => {
		if (Sound.suspendTimeout !== null) {
			clearTimeout(Sound.suspendTimeout);
			Sound.suspendTimeout = null;
		}
	};

	static sleepWhenQuiet = () => {
		Sound.stayAwake();

		Sound.suspendTimeout = setTimeout(() => {
			Sound.suspendTimeout = null;

			if (Sound.context) {
				Sound.context.suspend().catch(() => {
					// Error
				});
			}
		}, Sound.suspendDelay);
	};
}
