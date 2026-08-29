import { cursor } from './cursor';
import { gamePaused } from './game';
import { grid } from './grid';
import { derived } from 'svelte/store';

export const keyboardDisabled = derived(
	[cursor, grid, gamePaused],
	([$cursor, $grid, $gamePaused]) => {
		return ($cursor.x === null && $cursor.y === null) || $grid[$cursor.y][$cursor.x] !== 0 || $gamePaused;
	},
	false,
);