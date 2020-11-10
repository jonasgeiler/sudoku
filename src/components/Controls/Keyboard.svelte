<script>
	import { grid, userGrid } from '@sudoku/stores/grid';
	import { cursor } from '@sudoku/stores/cursor';

	function handleKey(num) {
		// Empty field
		if (grid.isEmpty($grid, $cursor.x, $cursor.y)) {
			userGrid.set($cursor.x, $cursor.y, num);
		}
	}
</script>

<div class="keyboard-grid">

	{#each Array(10) as _, keyNum}
		{#if keyNum === 9}
			<button class="btn btn-key" title="Erase Field" on:click={() => handleKey(0)}>
				<svg class="icon-outline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
				</svg>
			</button>
		{:else}
			<button class="btn btn-key" title="Insert {keyNum + 1}" on:click={() => handleKey(keyNum + 1)}>
				{keyNum + 1}
			</button>
		{/if}
	{/each}

</div>

<style>
	.keyboard-grid {
		@apply grid grid-rows-2 grid-cols-5 gap-3;
	}


	.btn-key {
		@apply py-4;
	}
</style>