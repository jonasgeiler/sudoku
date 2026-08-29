import { writable } from 'svelte/store';

function createTimer() {
	let timerInterval = null;
	let timeBegan = null;
	let timeStopped = null;
	let stoppedDuration = 0;
	let running = false;

	const timer = writable('00:00');

	// The timer uses a writable store but only returns a subscribe function so it's read-only
	return {
		subscribe: timer.subscribe,

		start() {
			if (running) return;

			if (timeBegan === null) {
				this.reset();
				timeBegan = Date.now();
			}

			if (timeStopped !== null) {
				stoppedDuration += (Date.now() - timeStopped);
			}

			timerInterval = setInterval(() => {
				const time = Date.now() - timeBegan - stoppedDuration;
				const timeStr = new Date(time).toISOString().substr(11, 8);

				if (timeStr.substr(0, 2) === '00') {
					timer.set(timeStr.substr(3));
					return;
				}

				timer.set(timeStr);
			}, 10);
			running = true;
		},

		stop() {
			running = false;
			timeStopped = Date.now();
			clearInterval(timerInterval);
		},

		reset() {
			running = false;
			clearInterval(timerInterval);
			stoppedDuration = 0;
			timeBegan = null;
			timeStopped = null;
			timer.set('00:00');
		},
	};
}

export const timer = createTimer();