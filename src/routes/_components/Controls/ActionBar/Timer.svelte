<script>
	import { onMount } from 'svelte';
	import { timer, timerRunning } from '@sudoku/stores/timer';
	import { timeToString } from '@sudoku/helpers'

	onMount(() => {
		timer.start();

		return timer.reset;
	})
</script>

<div class="timer-container">
	<span class="timer-text" title="Time">{timeToString($timer)}</span>

	<button class="btn btn-round" on:click={() => $timerRunning ? timer.pause() : timer.start()} title="{$timerRunning ? 'Pause Game' : 'Resume Game'}">
		<svg class="icon-outline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			{#if $timerRunning}
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 3v18M18 3v18" />
			{:else}
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.19 9.61L9.01 3.48A2.87 2.87 0 004.54 5.88v12.25a2.87 2.87 0 004.47 2.39l9.18-6.12a2.87 2.87 0 000-4.78v0z" />
			{/if}
		</svg>
	</button>
</div>

<style>
	.timer-container {
		@apply flex items-center bg-gray-300 rounded-full;
	}

	.timer-text {
		@apply px-4 text-2xl;
	}
</style>