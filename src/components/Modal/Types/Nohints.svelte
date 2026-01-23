<script>
	export let data = {};
	export let hideModal;

	function handleClose() {
		if (data.callback) data.callback();
		hideModal();
	}
</script>

<div class="no-hints-modal">
	<h1 class="title">{data.title || 'No Hints Available'}</h1>
	
	{#if data.text}
		<p class="message">{data.text}</p>
	{/if}
	
	<div class="button-group">
		<button class="btn btn-primary" on:click={handleClose}>
			{data.button || 'Okay'}
		</button>
	</div>
</div>

