import solve from '@mattflow/sudoku-solver';
import { BOX_SIZE, GRID_LENGTH, SUDOKU_SIZE, GRID_COORDS } from '@sudoku/constants';
import { getSudoku } from 'fake-sudoku-puzzle-generator';


/**
 * @param {('veryeasy' | 'easy' | 'medium' | 'hard')} difficulty
 * @returns {number[][]}
 */
export function generateSudoku(difficulty = 'easy') {
	const sudoku = getSudoku(difficulty);

	for (let row = 0; row < SUDOKU_SIZE; row++) {
		for (let col = 0; col < SUDOKU_SIZE; col++) {
			if (sudoku[row][col] === null) sudoku[row][col] = 0;
		}
	}

	return sudoku;
}


/**
 * @param {number[][]} sudoku
 */
export function solveSudoku(sudoku) {
	let grid = [
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
	];

	const solution = solve(sudoku.flat().join(''), {
		outputArray: true,
		hintCheck: false
	});

	for (let cell = 0; cell < GRID_LENGTH; cell++) {
		const [row, col] = GRID_COORDS[cell];
		grid[row][col] = solution[cell];
	}

	return grid;
}


/**
 * @param {number[][]} sudoku
 */
export function printSudoku(sudoku) {
	let out = '╔═══════╤═══════╤═══════╗\n';

	for (let row = 0; row < SUDOKU_SIZE; row++) {
		if (row !== 0 && row % BOX_SIZE === 0) {
			out += '╟───────┼───────┼───────╢\n';
		}

		for (let col = 0; col < SUDOKU_SIZE; col++) {
			if (col === 0) {
				out += '║ ';
			} else if (col % BOX_SIZE === 0) {
				out += '│ ';
			}

			out += (sudoku[row][col] === 0 ? '·' : sudoku[row][col]) + ' ';

			if (col === SUDOKU_SIZE - 1) {
				out += '║';
			}
		}

		out += '\n';
	}

	out += '╚═══════╧═══════╧═══════╝';

	console.log(out);
}