<script>
	import { fade, scale } from 'svelte/transition';
	import { modal, modalData } from '@sudoku/stores/modal';
	import { MODAL_NONE, MODAL_DURATION } from '@sudoku/constants';
	import types from './Types';

	const MODALS_DISABLED_OVERLAY = ['welcome', 'gameover'];

	function handleOverlayClick() {
		if (!MODALS_DISABLED_OVERLAY.includes($modal)) {
			modal.hide();
		}
	}
</script>

{#if $modal !== MODAL_NONE}
	<div class="modal">
		<button transition:fade={{duration: MODAL_DURATION}} class="modal-overlay" on:click={handleOverlayClick} tabindex="-1"></button>

		<div transition:scale={{duration: MODAL_DURATION}} class="modal-container">
			<div class="modal-content">
				<svelte:component this={types[$modal]} data={$modalData} hideModal={modal.hide} />
			</div>
		</div>
	</div>
{/if}

<style>
	.modal {
		@apply fixed z-40 w-full h-full top-0 left-0 flex items-center justify-center;
	}

	.modal-overlay {
		@apply fixed z-40 inset-0 h-full w-full bg-black bg-opacity-50 outline-none cursor-default;
	}

	.modal-container {
		@apply z-50 bg-gray-custom w-11/12 mx-auto rounded-xl shadow-lg overflow-y-auto;
	}

	.modal-content {
		@apply flex flex-col p-6 text-left;
	}


	@screen md {
		.modal-container {
			@apply max-w-md;
		}
	}
</style>