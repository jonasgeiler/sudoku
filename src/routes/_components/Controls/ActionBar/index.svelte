<script>
	import Timer from './Timer.svelte';
	import Actions from './Actions.svelte';
</script>

<div class="action-bar">
	<Timer />

	<Actions />
</div>

<style>
	.action-bar {
		@apply flex flex-wrap justify-between pb-5;
	}
</style>