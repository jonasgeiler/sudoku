<script>
	import { fade } from 'svelte/transition';
	import { SUDOKU_SIZE } from '@sudoku/constants';
	import { cursor } from '@sudoku/stores/cursor';
	import { grid, userGrid } from '@sudoku/stores/grid';
	import { settings } from '@sudoku/stores/settings';
	import { timerRunning } from '@sudoku/stores/timer';

	export let cellX;
	export let cellY;

	// 0 when not running or empty
	$: value = ($timerRunning && (grid.get($grid, cellX, cellY) || grid.get($userGrid, cellX, cellY))) || 0;

	$: sameArea = $settings.highlightCells &&
	              !cursor.isAt($cursor, cellX, cellY) &&
	              cursor.isInArea($cursor, cellX, cellY);

	$: sameNumber = $settings.highlightSame &&
	                !cursor.isAt($cursor, cellX, cellY) &&
	                !cursor.isInitial($cursor) &&
	                value &&
	                (grid.get($grid, $cursor.x, $cursor.y) || grid.get($userGrid, $cursor.x, $cursor.y)) === value;
</script>

<div class="cell row-start-{cellY} col-start-{cellX}"
     class:border-r={cellX !== SUDOKU_SIZE && cellX % 3 !== 0}
     class:border-r-4={cellX !== SUDOKU_SIZE && cellX % 3 === 0}
     class:border-b={cellY !== SUDOKU_SIZE && cellY % 3 !== 0}
     class:border-b-4={cellY !== SUDOKU_SIZE && cellY % 3 === 0}>

	{#if $timerRunning}
		<div class="cell-inner"
		     class:user-number={grid.isEmpty($grid, cellX, cellY)}
		     class:selected={cursor.isAt($cursor, cellX, cellY)}
		     class:same-area={sameArea}
		     class:same-number={sameNumber}>

			<button class="cell-btn" on:click={cursor.set(cellX, cellY)}>
				<span class="cell-text">{value || ''}</span>
			</button>

		</div>
	{/if}

</div>

<style>
	.cell {
		@apply h-full w-full row-end-auto col-end-auto;
	}

	.cell-inner {
		@apply relative h-full w-full transition-colors duration-100 text-gray-800;
	}

	.cell-btn {
		@apply absolute inset-0 h-full w-full;
	}

	.cell-btn:focus {
		@apply outline-none;
	}

	.cell-text {
		@apply leading-full text-2xl;
	}

	@screen sm {
		.cell-text {
			@apply text-3xl;
		}
	}

	.user-number {
		@apply text-primary;
	}

	.selected {
		@apply bg-primary text-white;
	}

	.same-area {
		@apply bg-primary-lighter;
	}

	.same-number {
		@apply bg-primary-light;
	}
</style>