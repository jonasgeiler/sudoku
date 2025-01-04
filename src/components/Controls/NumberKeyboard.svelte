<script>
	import { userGrid } from '@sudoku/stores/grid';
	import { keyboardDisabled } from '@sudoku/stores/keyboard';
	import { cursor } from '@sudoku/stores/cursor';
	import { notes } from '@sudoku/stores/notes';
	import { candidates } from '@sudoku/stores/candidates';
	import { StackManager, SetValueCommand, ResetCommand, SetNoteCommand, copyUserGrid, copyCandidates } from './ActionBar/Resetstack'

    export let number;
    $: disabled = false;//!($candidates.hasOwnProperty($cursor.x + ',' + $cursor.y) && $candidates[$cursor.x + ',' + $cursor.y].includes(number));

	function handleKeyButton(num) {

		if (!$keyboardDisabled) {
			if ($notes) {
				StackManager.pushCmd(new SetNoteCommand(copyUserGrid($userGrid), copyCandidates($candidates), num, {'x': $cursor.x, 'y': $cursor.y}));
				if (num === 0) {
					candidates.clear($cursor);
				} else {
					candidates.add($cursor, num);
				}
				userGrid.set($cursor, 0);
			} else {
				// 多候选值输入，启用回溯功能
				if ($candidates.hasOwnProperty($cursor.x + ',' + $cursor.y) && $candidates[$cursor.x + ',' + $cursor.y].length > 1) {
					StackManager.pushCmd(new ResetCommand(copyUserGrid($userGrid), copyCandidates($candidates), num, {'x': $cursor.x, 'y': $cursor.y}));
				}
				else {
					StackManager.pushCmd(new SetValueCommand(copyUserGrid($userGrid), copyCandidates($candidates), num, {'x': $cursor.x, 'y': $cursor.y}));
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