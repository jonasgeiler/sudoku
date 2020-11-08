<script>
	import { onMount, onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import Switch from '../../Utils/Switch.svelte';
	import { settings as settingsStore } from '@sudoku/stores/settings';

	export let data = {};
	export let hideModal = () => {
	};

	let settings = {...get(settingsStore)};

	function handleSave() {
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
	<Switch bind:checked={settings.darkTheme} text="Enable dark theme" id="dark-theme" />
	<Switch bind:checked={settings.displayTimer} text="Display timer while playing" id="display-timer" />
	<Switch bind:checked={settings.highlightCells} text="Highlight cells in same Row/Column/Box" id="highlight-cells" />
	<Switch bind:checked={settings.highlightMatching} text="Highlight matching digits" id="highlight-matching" />
	<Switch bind:checked={settings.highlightConflicting} text="Highlight conflicting digits" id="highlight-conflicting" />
</div>

<div class="flex justify-end">
	<button class="btn btn-small mr-3" on:click={hideModal}>Cancel</button>
	<button class="btn btn-small btn-primary" on:click={handleSave}>Save</button>
</div>