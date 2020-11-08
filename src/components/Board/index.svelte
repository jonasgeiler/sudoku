<script>
	import { onMount } from 'svelte';
	import Cell from './Cell.svelte';
	import { generateSudoku, printSudoku, solveSudoku } from '@sudoku/sudoku';
	import { encodeSudoku, decodeSencode } from '@sudoku/sencode';

	let field = [
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

	onMount(() => {
	});
</script>

<div class="board-padding relative z-10">
	<div class="max-w-xl relative">
		<div class="w-full" style="padding-top: 100%"></div>
	</div>
	<div class="board-padding absolute inset-0 flex justify-center">

		<div class="bg-white shadow-2xl rounded-xl w-full h-full max-w-xl grid">

			{#each Array(9) as _, row}
				{#each Array(9) as _, col}
					<div class="h-full w-full row-start-{row + 1} col-start-{col + 1} row-end-auto col-end-auto"
					     class:border-r={col + 1 !== 9 && (col + 1) % 3 !== 0}
					     class:border-r-4={col + 1 !== 9 && (col + 1) % 3 === 0}
					     class:border-b={row + 1 !== 9 && (row + 1) % 3 !== 0}
					     class:border-b-4={row + 1 !== 9 && (row + 1) % 3 === 0}>
						<Cell value={field[row][col]} />
					</div>
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