<script>
	import { SUDOKU_SIZE } from '@sudoku/constants';
	import { cursor } from '@sudoku/stores/cursor';
	import { grid, userGrid } from '@sudoku/stores/grid';

	export let cellX;
	export let cellY;
	$: value = grid.get($grid, cellX, cellY) || grid.get($userGrid, cellX, cellY) || 0;
</script>

<div class="h-full w-full row-start-{cellY} col-start-{cellX} row-end-auto col-end-auto"
     class:border-r={cellX !== SUDOKU_SIZE && cellX % 3 !== 0}
     class:border-r-4={cellX !== SUDOKU_SIZE && cellX % 3 === 0}
     class:border-b={cellY !== SUDOKU_SIZE && cellY % 3 !== 0}
     class:border-b-4={cellY !== SUDOKU_SIZE && cellY % 3 === 0}>

	<div class="relative h-full w-full transition-colors duration-100 text-gray-800"
	     class:user-number={grid.isEmpty($grid, cellX, cellY)}
	     class:selected={cursor.isAt($cursor, cellX, cellY)}
	     class:same-area={!cursor.isAt($cursor, cellX, cellY) && cursor.isInArea($cursor, cellX, cellY)}
	     class:same-number={!cursor.isAt($cursor, cellX, cellY) && !cursor.isInitial($cursor) && value && grid.get($grid, $cursor.x, $cursor.y) === value}>
		<button class="absolute inset-0 h-full w-full focus:outline-none" on:click={cursor.set(cellX, cellY)}>
			<span class="leading-full text-2xl sm:text-3xl">{value || ''}</span>
		</button>
	</div>

</div>

<style>
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