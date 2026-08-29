<script>
	import { slide } from 'svelte/transition';
	import Switch from '../../Utils/Switch.svelte';
	import { settings as settingsStore } from '@sudoku/stores/settings';
	import { MAX_HINTS } from '@sudoku/constants';

	export let data = {};
	export let hideModal;

	let settings = { ...$settingsStore };

	let hintsLimited = settings.hintsLimited;

	function handleSave() {
		settings.hintsLimited = hintsLimited;

		if (settings.hints < 0) settings.hints = 0;
		if (settings.hints > MAX_HINTS) settings.hints = MAX_HINTS;

		settingsStore.set(settings);
		hideModal();
	}
</script>

<h1 class="text-3xl font-semibold mb-6 leading-none">Settings</h1>

<!--

- Display Timer while playing
- Highlight cells in same Row/Column/Box
- Highlight matching digits
- Highlight conflicting digits
-

-->

<div class="flex flex-col mb-6 space-y-3">
	<!--<Switch bind:checked={settings.darkTheme} text="Enable dark theme" id="dark-theme" />-->
	<Switch bind:checked={settings.displayTimer} text="Display timer while playing" id="display-timer" />

	<Switch bind:checked={hintsLimited} text="Limit the number of hints available" id="hints-limited" />
	{#if hintsLimited}
		<div transition:slide class="inline-flex items-center">
			<label for="hints" class="flex-grow text-lg">Number of available hints</label>

			<input bind:value={settings.hints} class="number-input" id="hints" name="hints" type="number" min="0" max="81" />
		</div>
	{/if}

	<Switch bind:checked={settings.highlightCells} text="Highlight cells in same row/column/box" id="highlight-cells" />
	<Switch bind:checked={settings.highlightSame} text="Highlight cells with the same number" id="highlight-matching" />
	<Switch bind:checked={settings.highlightConflicting} text="Highlight conflicting numbers" id="highlight-conflicting" />
</div>

<div class="flex justify-end">
	<button class="btn btn-small mr-3" on:click={hideModal}>Cancel</button>
	<button class="btn btn-small btn-primary" on:click={handleSave}>Save</button>
</div>

<style>
	.number-input {
		@apply w-12 h-8 px-1 border-2 rounded-lg shadow-inner text-xl text-center leading-none;
	}

	.number-input:focus {
		@apply outline-none shadow-outline;
	}
</style>