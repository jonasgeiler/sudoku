<script>
	import { modal } from '@sudoku/stores/modal';

	export let data = {};

	const image = 'https://api.qrserver.com/v1/create-qr-code/?size=500x500&charset-source=UTF-8&charset-target=UTF-8&ecc=L&color=000&bgcolor=f7f9fc&margin=8&qzone=0&format=png&data=' + data.encodedLink;

	function select(element) {
		element.select();
		element.setSelectionRange(0, element.value.length);
	}
</script>

<img class="h-full w-full" src={image} />

<div class="mt-3">
	<button class="btn btn-small w-full" on:click={() => modal.show('share', data)}>
		<svg class="icon-outline mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
		</svg>

		<span>Back</span>
	</button>
</div>