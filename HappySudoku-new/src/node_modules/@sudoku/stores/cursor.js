import { SUDOKU_SIZE } from '@sudoku/constants';
import { writable } from 'svelte/store';

function createCursor() {
	const cursor = writable({ x: null, y: null });

	return {
		subscribe: cursor.subscribe,

		set(x, y) {
			cursor.set({ x, y });
		},

		move(xDir = 0, yDir = 0) {
			cursor.update($cursor => {
				let newX = $cursor.x + xDir;
				let newY = $cursor.y + yDir;

				if (newX < 0) newX = SUDOKU_SIZE - 1;
				if (newX >= SUDOKU_SIZE) newX = 0;
				if (newY < 0) newY = SUDOKU_SIZE - 1;
				if (newY >= SUDOKU_SIZE) newY = 0;

				return {
					x: newX,
					y: newY,
				};
			});
		},

		reset() {
			this.set(null, null);
		}
	};
}

export const cursor = createCursor();