<script>
	import { slide, fade } from 'svelte/transition';
	import { DIFFICULTIES } from '@sudoku/constants';
	import { difficulty } from '@sudoku/stores/difficulty';

	let menuOpened = false;
</script>

<div class="dropdown">
	<button class="dropdown-button" on:click={() => menuOpened = !menuOpened} title="{menuOpened ? 'Close' : 'Open'} Menu">
		<svg class="icon-outline mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h12" />
		</svg>

		<span class="text-2xl tracking-wider">{DIFFICULTIES[$difficulty]}</span>
	</button>

	{#if menuOpened}
		<button transition:fade class="dropdown-overlay" on:click={() => menuOpened = false} tabindex="-1"></button>

		<div transition:slide class="dropdown-menu">
			{#each Object.entries(DIFFICULTIES) as [difficultyValue, difficultyLabel]}
				<a class="dropdown-item" on:click|preventDefault={() => difficulty.set(difficultyValue)} href="/difficulty-{difficultyValue}" title="Set difficulty to {difficultyLabel}">
					<svg class="icon-solid" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
					</svg>

					<span class="align-middle">{difficultyLabel}</span>
				</a>
			{/each}

			<hr class="my-1">

			<a class="dropdown-item" on:click|preventDefault={() => {}} href="/create" title="Create your own Sudoku Game">
				<svg class="icon-solid" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
					<path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
				</svg>

				<span class="align-middle">Create Own</span>
			</a>
			<a class="dropdown-item" on:click|preventDefault={() => {}} href="/enter-code" title="Enter a Sudoku Code from a Friend">
				<svg class="icon-solid" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
					<path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
					<path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
				</svg>

				<span class="align-middle">Enter Code</span>
			</a>
		</div>
	{/if}
</div>

<style>
	.dropdown {
		@apply relative;
	}

	.dropdown-button {
		@apply relative z-30 block flex outline-none items-center;
	}

	.dropdown-overlay {
		@apply fixed z-20 inset-0 h-full w-full bg-black bg-opacity-50 outline-none cursor-default;
	}

	.dropdown-menu {
		@apply absolute z-30 left-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl;
	}


	.dropdown-item {
		@apply block px-4 py-2 text-gray-800 transition-colors duration-100 text-lg tracking-wide font-semibold;
	}

	.dropdown-item:hover {
		@apply bg-primary text-white;
	}

	.dropdown-item:active {
		@apply bg-primary-dark;
	}
</style>