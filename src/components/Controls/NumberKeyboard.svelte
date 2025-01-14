<script>
	import { userGrid } from '@sudoku/stores/grid';
	import { keyboardDisabled } from '@sudoku/stores/keyboard';
	import { cursor } from '@sudoku/stores/cursor';
	import { notes } from '@sudoku/stores/notes';
	import { candidates } from '@sudoku/stores/candidates';
	import { modal } from '@sudoku/stores/modal';
	import { strategyManager } from '@sudoku/sudokuStrategies/StrategyManager';
    import { ResetTree, copyUserGrid, gridSerialization } from '@sudoku/Resettree'

    export let number;
    $: disabled = false;

    function hasSolution(grid) {
        let candidatesList = strategyManager.applyStrategies(grid);
        for(let row = 0; row < 9; row++) {
            for(let col = 0; col < 9; col++) {
                if(grid[row][col] === 0 && candidatesList[row][col].length === 0) {
                    return false;
                }
            }
        }
        return true;
    }

    function handleKeyButton(num) {
        if (!$keyboardDisabled) {
            if ($notes) {
                //StackManager.pushCmd(new SetNoteCommand(copyUserGrid($userGrid), copyCandidates($candidates), num, {'x': $cursor.x, 'y': $cursor.y}));
                if (num === 0) {
                    candidates.clear($cursor);
                } else {
                    candidates.add($cursor, num);
                }
                userGrid.set($cursor, 0);
            } else {
                let isValidInput = !$candidates.hasOwnProperty($cursor.x + ',' + $cursor.y) || 
                                 $candidates[$cursor.x + ',' + $cursor.y].includes(num);
                
                if (!isValidInput) {
                    return;
                }

                if (ResetTree.hasResetPoint()) {
                    let tempGrid = copyUserGrid($userGrid);
                    tempGrid[$cursor.y][$cursor.x] = num;
                    if (!hasSolution(tempGrid)) {
                        modal.show('nosolution');
                        ResetTree.setFailure();
                        return;
                    }
                }


                if ($candidates.hasOwnProperty($cursor.x + ',' + $cursor.y)) {
                    candidates.clear($cursor);
                }

                userGrid.set($cursor, num);

                if ($candidates.hasOwnProperty($cursor.x + ',' + $cursor.y) && $candidates[$cursor.x + ',' + $cursor.y].length > 1) {
                    //StackManager.pushCmd(new ResetCommand(copyUserGrid($userGrid), copyCandidates($candidates), num, {'x': $cursor.x, 'y': $cursor.y}));
                    ResetTree.push(num, gridSerialization($userGrid), true);
                }
                else {
                    //StackManager.pushCmd(new SetValueCommand(copyUserGrid($userGrid), copyCandidates($candidates), num, {'x': $cursor.x, 'y': $cursor.y}));
                    ResetTree.push(num, gridSerialization($userGrid));
                }
            }
        }
    }

</script>

<button class="btn btn-key" disabled={$keyboardDisabled || disabled} title="Insert {number}" on:click={() => handleKeyButton(number)}>
    {number}
</button>