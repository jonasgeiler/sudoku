<script>
	import { BOX_SIZE } from '@sudoku/constants';
	import { timerRunning } from '@sudoku/stores/timer';
	import { grid, userGrid, invalidCells } from '@sudoku/stores/grid';
	import { settings } from '@sudoku/stores/settings';
	import { cursor } from '@sudoku/stores/cursor';
	import Cell from './Cell.svelte';

	function isSelected(cursorStore, x, y) {
		return cursorStore.x === x + 1 && cursorStore.y === y + 1;
	}

	function isSameArea(cursorStore, x, y) {
		const cursorX = cursorStore.x - 1;
		const cursorY = cursorStore.y - 1;

		if (cursorX === x || cursorY === y) return true;

		const cursorBoxX = Math.floor(cursorX / BOX_SIZE);
		const cursorBoxY = Math.floor(cursorY / BOX_SIZE);
		const cellBoxX = Math.floor(x / BOX_SIZE);
		const cellBoxY = Math.floor(y / BOX_SIZE);
		return (cursorBoxX === cellBoxX && cursorBoxY === cellBoxY);
	}

	function getValueAtCursor(gridStore, cursorStore) {
		if (cursorStore.x === 0 && cursorStore.y === 0) return null;

		return gridStore[cursorStore.y - 1][cursorStore.x - 1];
	}
</script>

<div class="board-padding relative z-10">
	<div class="max-w-xl relative">
		<div class="w-full" style="padding-top: 100%"></div>
	</div>
	<div class="board-padding absolute inset-0 flex justify-center">

		<div class="bg-white shadow-2xl rounded-xl overflow-hidden w-full h-full max-w-xl grid" class:bg-gray-200={!$timerRunning}>

			{#each $userGrid as row, y}
				{#each row as value, x}
					<Cell {value}
					      cellY={y + 1}
					      cellX={x + 1}
					      selected={isSelected($cursor, x, y)}
					      userNumber={$grid[y][x] === 0}
					      sameArea={$settings.highlightCells && !isSelected($cursor, x, y) && isSameArea($cursor, x, y)}
					      sameNumber={$settings.highlightSame && value && !isSelected($cursor, x, y) && getValueAtCursor($userGrid, $cursor) === value}
					      conflictingNumber={$settings.highlightConflicting && $grid[y][x] === 0 && $invalidCells.includes((x + 1) + ',' + (y + 1))} />
				{/each}
			{/each}

		</div>

	</div>
</div>

<style>
	.board-padding {
		@apply px-4 pb-4;
	}
</style>