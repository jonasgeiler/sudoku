<!-- 把相关的资源集中在一起，以方便管理-->

<script>
	import Buttons from './Buttons.svelte';
	import Dropdown from './Dropdown.svelte';
</script>

<div class="px-4 py-4 flex justify-center text-white">
	<div class="w-full max-w-xl">

		<nav class="flex flex-wrap items-center justify-between">
			<Dropdown />

			<Buttons />
		</nav>

	</div>
</div>