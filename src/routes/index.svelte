<script>
	import Controls from './_components/Controls/index.svelte';
	import Header from './_components/Header/index.svelte';
	import Board from './_components/Board/index.svelte';
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
