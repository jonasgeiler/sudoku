import { GRID_COORDS, GRID_LENGTH, SENCODE_REGEX, SENCODE_SEPARATOR as SEPARATOR, SENCODE_SEPARATOR_REVERSE as SEPARATOR_REVERSE } from '@sudoku/constants';
import Base62 from './base62';


/**
 * @param {number[]} flatGrid
 * @returns {boolean}
 */
function shouldReverse(flatGrid) {
	for (let cell = 0; cell < GRID_LENGTH; cell++) {
		if (flatGrid[(GRID_LENGTH - 1) - cell] !== 0) {
			return false;
		} else if (flatGrid[cell] !== 0) {
			return true;
		}
	}

	return false;
}


/**
 * @param {number[][]} sudoku
 * @returns {string}
 */
export function encodeSudoku(sudoku) {
	/** @type number[] */
	const flatGrid = sudoku.flat();

	const reversed = shouldReverse(flatGrid);
	if (reversed) {
		// Reverse sudoku array
		flatGrid.reverse();
	}

	let structure = '';
	let numbers = '';

	for (let cell = 0; cell < GRID_LENGTH; cell++) {
		structure += (flatGrid[cell] === 0 ? '0' : '1');

		if (flatGrid[cell] > 0) {
			numbers += flatGrid[cell] - 1; // Subtract 1 so the number gets smaller
		}
	}

	return Base62.encode(BigInt('0b' + structure)) +
	       (reversed ? SEPARATOR_REVERSE : SEPARATOR) +
	       Base62.encode(BigInt(numbers));
}


/**
 * @param {string} sencode
 * @returns {number[][]}
 */
export function decodeSencode(sencode) {
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

	const reversed = sencode.indexOf(SEPARATOR_REVERSE) !== -1;

	const [encodedStructure, encodedNumbers] = sencode.split(reversed ? SEPARATOR_REVERSE : SEPARATOR);

	const structure = Base62.decode(encodedStructure)
	                        .toString(2)
	                        .padStart(GRID_LENGTH, '0');

	let numberCount = 0;
	for (let cell = 0; cell < GRID_LENGTH; cell++) {
		if (structure[cell] === '1') {
			numberCount++;
		}
	}

	let numbers = Base62.decode(encodedNumbers)
	                    .toString()
	                    .padStart(numberCount, '0')
	                    .split('');

	for (let cell = 0; cell < GRID_LENGTH; cell++) {
		if (structure[cell] === '1') {
			const [row, col] = GRID_COORDS[cell];
			grid[row][col] = numbers.shift() * 1 + 1;
		}
	}

	if (reversed) {
		// Reverse Grid
		grid = grid.reverse().map(row => row.reverse());
	}

	return grid;
}


/**
 * @param {string} sencode
 * @returns {boolean}
 */
export function validateSencode(sencode) {
	return sencode && sencode.trim().length !== 0 && SENCODE_REGEX.test(sencode);
}