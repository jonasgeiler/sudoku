import { cursor } from './stores/cursor';
import { difficulty } from './stores/difficulty';
import { gamePaused } from './stores/game';
import { grid } from './stores/grid';
import { timer } from './stores/timer';
import { hints } from './stores/hints';

/**
 * Start new game with a generated sudoku
 *
 * @param {('veryeasy' | 'easy' | 'medium' | 'hard')} diff - Difficulty
 */
export function startNew(diff) {
	difficulty.set(diff);
	grid.generate(diff);
	cursor.reset();
	timer.reset();
	hints.reset();

	location.hash = '';
}

/**
 * Start new game with a custom sudoku
 *
 * @param {string} sencode - Sencode to decode
 */
export function startCustom(sencode) {
	difficulty.setCustom();
	grid.decodeSencode(sencode);
	cursor.reset();
	timer.reset();
	hints.reset();
}

/**
 * Pause the game
 */
export function pauseGame() {
	timer.stop();
	gamePaused.set(true);
}

/**
 * Resume (un-pause) the game
 */
export function resumeGame() {
	timer.start();
	gamePaused.set(false);
}

export default {
	startNew,
	startCustom,
	pause: pauseGame,
	resume: resumeGame
};