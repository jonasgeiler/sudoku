export const BASE_URL = 'https://sudoku.jonasgeiler.com/';

export const DIFFICULTY_CUSTOM = 'custom';
export const DIFFICULTIES = {
	veryeasy: 'Very Easy',
	easy:     'Easy',
	medium:   'Medium',
	hard:     'Hard',
};

export const DEFAULT_SETTINGS = {
	darkTheme:            false,
	displayTimer:         true,
	hintsLimited:         true,
	hints:                5,
	highlightCells:       true,
	highlightSame:        true,
	highlightConflicting: true,
};
export const MAX_HINTS = 99999;

export const SUDOKU_SIZE = 9;
export const BOX_SIZE = 3;
export const GRID_LENGTH = SUDOKU_SIZE * SUDOKU_SIZE;
export const GRID_COORDS = [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[1,8],[2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7],[2,8],[3,0],[3,1],[3,2],[3,3],[3,4],[3,5],[3,6],[3,7],[3,8],[4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6],[4,7],[4,8],[5,0],[5,1],[5,2],[5,3],[5,4],[5,5],[5,6],[5,7],[5,8],[6,0],[6,1],[6,2],[6,3],[6,4],[6,5],[6,6],[6,7],[6,8],[7,0],[7,1],[7,2],[7,3],[7,4],[7,5],[7,6],[7,7],[7,8],[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,6],[8,7],[8,8]];
export const CANDIDATE_COORDS = [[1, 1],[1, 2],[1, 3],[2, 1],[2, 2],[2, 3],[3, 1],[3, 2],[3, 3]];

export const SENCODE_SEPARATOR = '-';
export const SENCODE_SEPARATOR_REVERSE = '_';
export const SENCODE_REGEX = new RegExp('^[a-zA-Z0-9]+[' + SENCODE_SEPARATOR + SENCODE_SEPARATOR_REVERSE + '][a-zA-Z0-9]+$');

export const BASE62_CHARSET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const MODAL_NONE = 'none'; // Modal type when hidden
export const MODAL_DURATION = 400;

export const DROPDOWN_DURATION = MODAL_DURATION;

export const GAME_OVER_CELEBRATIONS = [
	'Excellent!',
	'Wow!',
	'Congratulations!',
	'Oh yeah!',
	'Impressive!',
	'Good work!',
	'You did great!',
	'Applause!',
	'Great!'
]