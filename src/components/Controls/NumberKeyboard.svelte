<script>
	import { userGrid } from '@sudoku/stores/grid';
	import { keyboardDisabled } from '@sudoku/stores/keyboard';
	import { cursor } from '@sudoku/stores/cursor';
	import { notes } from '@sudoku/stores/notes';
	import { candidates } from '@sudoku/stores/candidates';
	import { commandStack, ResetCommand, copyCandidates, copyUserGrid } from './ActionBar/Resetstack'

    export let number;
    $: disabled = false;//!($candidates.hasOwnProperty($cursor.x + ',' + $cursor.y) && $candidates[$cursor.x + ',' + $cursor.y].includes(number));

	function handleKeyButton(num) {

		if (!$keyboardDisabled) {
			if ($notes) {
				if (num === 0) {
					candidates.clear($cursor);
				} else {
					candidates.add($cursor, num);
				}
				userGrid.set($cursor, 0);
			} else {
				// 多候选值输入，启用回溯功能
				if ($candidates.hasOwnProperty($cursor.x + ',' + $cursor.y) && $candidates[$cursor.x + ',' + $cursor.y].length > 1) {
					$commandStack.push(new ResetCommand(copyUserGrid($userGrid), copyCandidates($candidates), num, {'x': $cursor.x, 'y': $cursor.y}));
				}

				if ($candidates.hasOwnProperty($cursor.x + ',' + $cursor.y)) {
					candidates.clear($cursor);
				}

				userGrid.set($cursor, num);
			}
		}
	}

</script>

<button class="btn btn-key" disabled={$keyboardDisabled || disabled} title="Insert {number}" on:click={() => handleKeyButton(number)}>
    {number}
</button>