import { DEFAULT_SETTINGS } from '@sudoku/constants';
import { writable } from 'svelte/store';

function createSettings() {
	const settings = writable((() => {
		const storedSettings = localStorage.getItem('settings');

		if (storedSettings) {
			return JSON.parse(storedSettings);
		}

		return DEFAULT_SETTINGS;
	})());

	return {
		subscribe: settings.subscribe,

		set(newSettings) {
			settings.set(newSettings);
			localStorage.setItem('settings', JSON.stringify(newSettings));
		},
	};
}

export const settings = createSettings();