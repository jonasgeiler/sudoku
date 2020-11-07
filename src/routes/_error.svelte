<script>
	export let status;
	export let error;

	const dev = process.env.NODE_ENV === 'development';
</script>

<style>
	h1, p {
		margin: 0 auto;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}
</style>

<svelte:head>
	<title>Sudoku | Error {status}</title>
</svelte:head>

<div class="flex flex-col justify-center items-center h-screen">
	<div class="relative shadow-2xl">
		<div class="rounded-t-lg overflow-hidden border-t border-l border-r border-gray-400 bg-white py-4 px-12"
		     class:rounded-b-lg={!(dev && error.stack)}
		     class:border-b={!(dev && error.stack)}>
			<div class="text-center mb-6">
				<h1 class="text-6xl font-semibold">{status}</h1>

				<p class="text-xl">{error.message}</p>
			</div>
		</div>

		{#if dev && error.stack}
			<div class="rounded-b-lg bg-gray-800 text-white">
				<pre class="scrollbar-none m-0 p-0">
					<code class="inline-block p-4 scrolling-touch">{error.stack}</code>
				</pre>
			</div>
		{/if}
	</div>
</div>