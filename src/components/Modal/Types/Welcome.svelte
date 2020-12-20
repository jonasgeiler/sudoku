<script>
	import { difficulty as difficultyStore } from '@sudoku/stores/difficulty';
	import { startNew, startCustom } from '@sudoku/game';
	import { validateSencode } from '@sudoku/sencode';
	import { DIFFICULTIES } from '@sudoku/constants';

	export let data = {};
	export let hideModal;

	let difficulty = $difficultyStore;
	let sencode = data.sencode || '';

	$: enteredSencode = sencode.trim().length !== 0;
	$: buttonDisabled = enteredSencode ? !validateSencode(sencode) : !DIFFICULTIES.hasOwnProperty(difficulty);

	function handleStart() {
		if (validateSencode(sencode)) {
			startCustom(sencode);
		} else {
			startNew(difficulty);
		}

		hideModal();
	}
</script>

<h1 class="text-3xl font-semibold mb-6 leading-none">Welcome!</h1>

{#if data.sencode}
	<div class="p-3 text-lg rounded bg-primary bg-opacity-25 border-l-8 border-primary border-opacity-75 mb-4">
		Someone shared a Sudoku puzzle with you!<br>Just click start if you want to play it
	</div>
{/if}

<label for="difficulty" class="text-lg mb-3">To start a game, choose a difficulty:</label>

<div class="inline-block relative mb-6">
	<select id="difficulty" class="btn btn-small w-full appearance-none leading-normal" bind:value={difficulty} disabled={enteredSencode}>
		{#each Object.entries(DIFFICULTIES) as [difficultyValue, difficultyLabel]}
			<option value={difficultyValue}>{difficultyLabel}</option>
		{/each}
	</select>

	<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
		<svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
			<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
		</svg>
	</div>
</div>

<label for="sencode" class="text-lg mb-3">Or, if you have a code for a custom Sudoku puzzle, enter it here:</label>

<input id="sencode" class="input font-mono mb-5" bind:value={sencode} type="text">

<div class="flex justify-end">
	<button class="btn btn-small btn-primary" disabled={buttonDisabled} on:click={handleStart}>Start</button>
</div>