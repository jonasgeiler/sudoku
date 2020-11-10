<script>
	import { onMount } from 'svelte';
	import { timerRunning } from '@sudoku/stores/timer';
	import Cell from './Cell.svelte';

	onMount(() => {
	});
</script>

<div class="board-padding relative z-10">
	<div class="max-w-xl relative">
		<div class="w-full" style="padding-top: 100%"></div>
	</div>
	<div class="board-padding absolute inset-0 flex justify-center">

		<div class="bg-white shadow-2xl rounded-xl overflow-hidden w-full h-full max-w-xl grid" class:bg-gray-200={!$timerRunning}>

			{#each Array(9) as _, row}
				{#each Array(9) as _, col}
					<Cell cellY={row + 1} cellX={col + 1} />
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