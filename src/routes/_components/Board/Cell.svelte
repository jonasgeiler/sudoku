<script>
	export let value;
</script>

<div class="relative h-full w-full">
	<button class="absolute inset-0 h-full w-full focus:outline-none text-gray-800">
		<span class="leading-full text-2xl sm:text-3xl">{value || ''}</span>
	</button>
</div>