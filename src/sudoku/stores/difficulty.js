import { DIFFICULTIES, DIFFICULTY_CUSTOM } from '@sudoku/constants';
import { writable } from 'svelte/store';

function createDifficulty() {
	const difficulty = writable((() => {
		const storedDifficulty = localStorage.getItem('difficulty');

		if (DIFFICULTIES.hasOwnProperty(storedDifficulty)) {
			return storedDifficulty;
		}

		return Object.keys(DIFFICULTIES)[0];
	})());

	return {
		subscribe: difficulty.subscribe,

		set(newDifficulty) {
			if (DIFFICULTIES.hasOwnProperty(newDifficulty)) {
				difficulty.set(newDifficulty);
				localStorage.setItem('difficulty', newDifficulty);
			}
		},

		setCustom() {
			difficulty.set(DIFFICULTY_CUSTOM);
		}
	};
}

export const difficulty = createDifficulty();