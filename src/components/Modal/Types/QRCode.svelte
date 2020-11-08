<script>
	import { BASE_URL } from '@sudoku/constants';

	export let data = {};

	const link = BASE_URL + '?' + data.code;
	const image = 'https://api.qrserver.com/v1/create-qr-code/?size=500x500&charset-source=UTF-8&charset-target=UTF-8&ecc=L&color=000&bgcolor=fff&margin=8&qzone=0&format=png&data=' + encodeURIComponent(link);

	function select(element) {
		element.select();
		element.setSelectionRange(0, element.value.length);
	}
</script>

<img class="h-full w-full" src={image} />