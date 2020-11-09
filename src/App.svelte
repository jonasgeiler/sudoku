<script>
	import Clipboard from './components/Utils/Clipboard.svelte';
	import Board from './components/Board/index.svelte';
	import Controls from './components/Controls/index.svelte';
	import Header from './components/Header/index.svelte';
	import Modal from './components/Modal/index.svelte';

	let copyText;
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