import { invalidCells, userGrid } from './grid';
import { SUDOKU_SIZE } from '@sudoku/constants';
import { derived, writable } from 'svelte/store';

export const gamePaused = writable(true);

export const gameWon = derived(
	[userGrid, invalidCells],
	([$userGrid, $invalidCells]) => {
		for (let row = 0; row < SUDOKU_SIZE; row++) {
			for (let col = 0; col < SUDOKU_SIZE; col++) {
				if ($userGrid[row][col] === 0) return false;
			}
		}
		// No empty fields...

		return ($invalidCells.length === 0);
	},
	false,
);