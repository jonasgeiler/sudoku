<script>
	export let hideModal;
</script>

<h1 class="text-3xl font-semibold mb-6 leading-none">No Solotion</h1>

<label for="tips" class="text-lg mb-3">No Solution in current try, Go back find other ways.</label>

<div class="flex justify-end">
	<button class="btn btn-small mr-3" on:click={hideModal}>Cancel</button>
	<button class="btn btn-small mr-3" on:click={hideModal}>Continue</button>
</div>