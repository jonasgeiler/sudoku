<script>
	import { onMount } from 'svelte';
	import { BASE_URL } from '@sudoku/constants';
	import { modal } from '@sudoku/stores/modal';
	import { grid } from '@sudoku/stores/grid';
	import Clipboard from '../../Utils/Clipboard.svelte';

	export let data = {};
	export let hideModal;

	const sencode = grid.getSencode($grid);

	const link = BASE_URL + '#' + sencode;
	const encodedLink = encodeURIComponent(link);
	const facebookLink = 'https://www.facebook.com/sharer/sharer.php?u=' + encodedLink;
	const twitterLink = 'https://twitter.com/intent/tweet?text=Check%20out%20this%20Sudoku%20puzzle!&url=' + encodedLink;
	const mailToLink = 'mailto:?subject=A%20Sudoku%20puzzle%20for%20you&body=Here%27s%20a%20link%20to%20a%20Sudoku%20puzzle%20on%20sudoku.jonasgeiler.com%3A%0A%0A' + encodedLink;

	let copyText;

	function select(element) {
		element.select();
		element.setSelectionRange(0, element.value.length);
	}

	onMount(() => {
		let canShare = false;
		const shareData = {
			url: link,
			title: 'Sudoku',
			text: 'Create & play Sudoku puzzles for free online on sudoku.jonasgeiler.com!'
		};

		if ('share' in navigator) {
			canShare = true;
		}

		if ('canShare' in navigator) {
			canShare = navigator.canShare(shareData);
		}

		if (canShare) {
			navigator.share(shareData);
		}
	});
</script>

<div class="flex justify-between items-center mb-6">
	<h1 class="text-3xl font-semibold leading-none">Share Sudoku</h1>

	<div class="cursor-pointer" on:click={hideModal}>
		<svg class="icon-outline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
		</svg>
	</div>
</div>

<div class="code-container">
	<input class="input code-field" type="text" readonly value={sencode} on:click={e => select(e.target)}>

	<button class="btn btn-copy" on:click={copyText(sencode)}>
		<svg class="icon-outline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
		</svg>
	</button>
</div>

<hr class="my-8" />

<div class="flex flex-col space-y-2">

	<a href={link} class="btn btn-small" on:click|preventDefault={copyText(link)}>
		<svg class="icon-outline mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
		</svg>

		<span>Copy Link</span>
	</a>

	<a href={twitterLink} target="_blank" class="btn btn-share btn-share-twitter btn-small">
		<svg class="icon-outline mr-2" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke="none">
			<path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
		</svg>

		<span>Share on Twitter</span>
	</a>

	<a href={facebookLink} target="_blank" class="btn btn-share btn-share-facebook btn-small">
		<svg class="icon-outline mr-2" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke="none">
			<path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
		</svg>

		<span>Share on Facebook</span>
	</a>

	<a href={mailToLink} target="_blank" class="btn btn-small">
		<svg class="icon-outline mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
		</svg>

		<span>Share by Email</span>
	</a>

	<button class="btn btn-small" on:click={() => modal.show('qrcode', { ...data, encodedLink })}>
		<svg class="icon-outline mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
		</svg>

		<span>Share QR Code</span>
	</button>
</div>

<Clipboard bind:copyText />

<style>
	.code-container {
		@apply flex flex-col;
	}

	.code-field {
		@apply rounded-b-none font-mono text-center;
	}

	.btn-copy {
		@apply p-3 rounded-t-none;
	}

	@screen sm {
		.code-container {
			@apply flex-row;
		}

		.code-field {
			@apply flex-grow rounded-bl-xl rounded-r-none;
		}

		.btn-copy {
			@apply rounded-tr-xl rounded-l-none;
		}
	}


	.btn-share {
		@apply text-white border-none;
	}

	.btn-share-twitter {
		background-color: #1da1f2;
	}

	.btn-share-twitter:hover {
		background-color: #1a91da;
	}

	.btn-share-twitter:active {
		background-color: #1781c2;
	}

	.btn-share-facebook {
		background-color: #1877f2;
	}

	.btn-share-facebook:hover {
		background-color: #166bda;
	}

	.btn-share-facebook:active {
		background-color: #135fc2;
	}
</style>