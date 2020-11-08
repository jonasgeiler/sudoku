<script>
	import Board from '../components/Board/index.svelte';
	import Controls from '../components/Controls/index.svelte';
	import Header from '../components/Header/index.svelte';
	import Modal from '../components/Modal/index.svelte';
</script>

<svelte:head>
	<title>Sudoku</title>
</svelte:head>

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

<Modal />