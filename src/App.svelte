<script>
	import Board from './components/Board/index.svelte';
	import Controls from './components/Controls/index.svelte';
	import Header from './components/Header/index.svelte';
	import Modal from './components/Modal/index.svelte';
</script>

<main>
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
</main>

<style global>
	@import "./styles/global.css";

	main {
		@apply flex flex-col h-screen;
	}

	main > header {
		@apply flex-grow;
	}

	main > footer {
		@apply flex flex-grow flex-col justify-end;
	}
</style>