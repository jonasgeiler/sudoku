<script>
	import { DIFFICULTIES, DIFFICULTY_CUSTOM, GAME_OVER_CELEBRATIONS } from '@sudoku/constants';
	import { resumeGame } from '@sudoku/game';
	import { modal } from '@sudoku/stores/modal';
	import { timer } from '@sudoku/stores/timer';
	import { difficulty } from '@sudoku/stores/difficulty';
	import { usedHints } from '@sudoku/stores/hints';

	const gameOverCelebration = GAME_OVER_CELEBRATIONS[Math.floor(Math.random() * GAME_OVER_CELEBRATIONS.length)];

	function handleShare() {
		modal.show('share', { onHide: () => modal.show('gameover'), onHideReplace: true });
	}

	function handleNewGame() {
		modal.show('welcome', { onHide: resumeGame });
	}
</script>

<div class="flex flex-col text-center items-center">
	<svg class="h-32 w-32 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<path d="M1 6.417c0-1.013.822-1.833 1.834-1.833 1.215 0 2.104 1.167 1.763 2.329-.559 1.915 5.827 3.731 6.771-1.471.239-1.323-.021-1.67-.668-2.321-.329-.329-.534-.783-.534-1.287 0-1.013.822-1.834 1.834-1.834 1.014 0 1.833.821 1.833 1.833 0 .504-.204.958-.533 1.287-.646.65-.905.998-.666 2.321.941 5.2 7.33 3.387 6.77 1.471-.339-1.162.548-2.329 1.764-2.329 1.012 0 1.832.821 1.832 1.834 0 1.118-.992 1.97-2.084 1.816-1.32-.187-3.03 4.554-3.417 6.716-1.765-.615-3.618-.942-5.493-.949-1.875.006-3.74.334-5.504.949-.388-2.162-2.098-6.903-3.418-6.717-1.092.155-2.084-.697-2.084-1.815zm-1 14.583h2.359l.566 3c.613-1.012 1.388-1.912 2.277-2.68l-2.342-3.335c-1.089.879-2.053 1.848-2.86 3.015zm24 0h-2.359l-.566 3c-.613-1.012-1.388-1.912-2.277-2.68l2.343-3.335c1.088.879 2.052 1.848 2.859 3.015zm-12-4.998c-2.845.009-5.491.825-7.757 2.211l2.334 3.322c1.603-.924 3.448-1.464 5.423-1.473 1.975.009 3.82.549 5.423 1.473l2.334-3.322c-2.266-1.386-4.912-2.202-7.757-2.211zm-3.022 3.498l-.65-.348-.651.348.131-.726-.531-.511.729-.101.321-.662.322.663.729.101-.53.511.13.725zm3.672-.5l-.65-.348-.65.348.131-.726-.531-.511.729-.101.321-.662.322.663.729.101-.53.511.129.725zm3.718.5l-.65-.348-.65.348.131-.726-.531-.511.729-.101.322-.663.322.663.729.101-.53.511.128.726z" />
	</svg>

	<h1 class="text-4xl font-semibold">{gameOverCelebration}</h1>
</div>

<div class="game-data space-y-2">
	<div class="game-data-item">
		<div class="item-icon">
			<svg class="icon-outline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
		</div>

		<div class="item-data">
			<div class="item-data-label">
				Time:
			</div>

			<div class="item-data-value">
				{$timer}
			</div>
		</div>
	</div>

	<div class="game-data-item">
		<div class="item-icon">
			<svg class="icon-outline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
			</svg>
		</div>

		<div class="item-data">
			<div class="item-data-label">
				Difficulty:
			</div>

			<div class="item-data-value">
				{$difficulty === DIFFICULTY_CUSTOM ? 'Custom' : DIFFICULTIES[$difficulty]}
			</div>
		</div>
	</div>

	<div class="game-data-item">
		<div class="item-icon">
			<svg class="icon-outline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
			</svg>
		</div>

		<div class="item-data">
			<div class="item-data-label">
				Hints used:
			</div>

			<div class="item-data-value">
				{$usedHints}
			</div>
		</div>
	</div>
</div>

<button class="btn btn-small w-full mb-2" on:click={handleShare}>Share this Sudoku puzzle</button>
<button class="btn btn-small btn-primary w-full" on:click={handleNewGame}>New Game</button>

<style>
	.game-data {
		@apply mt-6 mb-10 w-full text-xl;
	}

	.game-data-item {
		@apply flex;
	}

	.item-icon {
		@apply flex-auto mr-3;
	}

	.item-data {
		@apply flex-grow w-full flex flex-wrap border-b-2 border-gray-300 pb-1;
	}

	.item-data-label {
		@apply w-1/2 text-left;
	}

	.item-data-value {
		@apply w-1/2 text-right;
	}
</style>