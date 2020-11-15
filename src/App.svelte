<script>
	import { onMount } from 'svelte';
	import game from '@sudoku/game';
	import { SENCODE_REGEX } from '@sudoku/constants';
	import { difficulty } from '@sudoku/stores/difficulty';
	import Clipboard from './components/Utils/Clipboard.svelte';
	import Board from './components/Board/index.svelte';
	import Controls from './components/Controls/index.svelte';
	import Header from './components/Header/index.svelte';
	import Modal from './components/Modal/index.svelte';

	let copyText;

	// TODO: Show starting modal
	onMount(() => {
		let hash = location.hash;

		if (hash.startsWith('#')) {
			hash = hash.slice(1);
		}

		if (hash.trim().length !== 0 && SENCODE_REGEX.test(hash)) {
			game.startCustom(hash);
		} else {
			game.startNew($difficulty);
		}

		game.resume();
	});
</script>

<!-- Timer, Menu, etc. -->
<header>
	<Header />
</header>

<!-- Sudoku Field -->
<section>
	<Board />
</section>

<!-- Keyboard -->
<footer>
	<Controls />
</footer>

<Modal {copyText} />
<Clipboard bind:copyText />

<style global>
	@import "./styles/global.css";
</style>