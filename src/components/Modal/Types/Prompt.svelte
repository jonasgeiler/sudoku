<script>
	export let data = {};
	export let hideModal = () => {
	};

	let value = '';

	function handleButton() {
		if (data.callback) data.callback(value);
		hideModal();
	}
</script>

<h1 class="text-3xl font-semibold mb-5 leading-none">{data.title || 'Please enter something'}</h1>

{#if data.text}
	<p class="text-lg mb-4">{data.text}</p>
{/if}

<input class="input mb-5" class:font-mono={data.fontMono} bind:value type="text">

<div class="flex justify-end">
	<button class="btn btn-small mr-3" on:click={hideModal}>Cancel</button>
	<button class="btn btn-small btn-primary" disabled={data.validate ? !data.validate(value) : false} on:click={handleButton}>{data.button || 'Okay'}</button>
</div>