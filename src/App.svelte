<script>
	import { onMount } from 'svelte';
	import { validateSencode } from '@sudoku/sencode';
	import game from '@sudoku/game';
	import { modal } from '@sudoku/stores/modal';
	import { SENCODE_REGEX } from '@sudoku/constants';
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

		if (validateSencode(hash)) {
			// TODO: Show modal to confirm starting custom game (maybe reuse welcome modal)
			game.startCustom(hash);
			game.resume();
		} else {
			modal.show('welcome', { onHide: game.resume });
		}
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