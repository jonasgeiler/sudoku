import { userGrid } from '@sudoku/stores/grid';
import { SUDOKU_SIZE } from '@sudoku/constants';
import { writable } from 'svelte/store';
import { candidates } from '@sudoku/stores/candidates';

// 命令栈
function createCommandStack() {
    const stack = writable([]);

    return {
        subscribe: stack.subscribe,

        push(value) {
            stack.update($stack => {
                $stack.push(value);
                return $stack;
            });
        },

        // 有返回值
        popAndUndoIfValid() {
            let item_from_undo_return;
            stack.update($stack => {
                if ($stack.length === 0)
                    return $stack;

                item_from_undo_return = $stack[$stack.length - 1].undo();
                return $stack;
            });
            return item_from_undo_return;
        },
    }
}
export const commandStack = new createCommandStack();

// 命令基类
//export function CommandBase() {
//    this.undo = function() {}
//};

// "x, y" to {x, y}
function convertCandidateStringToObject(str) {
    const parts = str.split(',');
    if (parts.length !== 2) {
        return {};
    }
    const x = parseInt(parts[0], 10);
    const y = parseInt(parts[1], 10);
    return {x, y};
}

// 回溯命令
export function ResetCommand(grid_bk, candidates_bk, try_number, cell_index){
    this.grid_bk = grid_bk;
    this.candidates_bk = candidates_bk;

    this.undo = function() {
        // 重置网格
        for (let y = 0; y < SUDOKU_SIZE; y++) {
            for (let x = 0; x < SUDOKU_SIZE; x++) {
                userGrid.set({y, x}, grid_bk[y][x]);
            }
        }

        // 清空所有候选值
        for (let y = 0; y < SUDOKU_SIZE; y++) {
            for (let x = 0; x < SUDOKU_SIZE; x++) {
                candidates.clear({y, x});
            }
        }
        // 重置候选值
		for (let [key, value] of Object.entries(this.candidates_bk)) {
            let pos = convertCandidateStringToObject(key);
            candidates.clear(pos);
            for (let i of value)
                candidates.add(pos, i);
		}

        // 返回错误数字和cell索引
        return {try_number, cell_index};
    };
}

// 复制当前userGrid（$userGrid会自动更新，不能用$userGrid传值）
export function copyUserGrid(grid) {
    let newGrid = [];
    for (let y = 0; y < SUDOKU_SIZE; y++) {
        newGrid[y] = [];
        for (let x = 0; x < SUDOKU_SIZE; x++) {
            newGrid[y][x] = grid[y][x];
        }
    }
    return newGrid;
}
// 复制当前candidates（$candidates会自动更新，不能用$candidates传值）
export function copyCandidates(candidates) {
    let newCandidates = {};
    for (let [key, value] of Object.entries(candidates)) {
        newCandidates[key] = value;
    }
    return newCandidates;
}

//    function handleReset() {
//		$commandStack.push(new ResetCommand(copyUserGrid(), copyCandidates()));
//
//		// set value method
//        userGrid.set({x:0, y:1}, 10);// ok
//		candidates.add({x:0, y:0}, 1);
//    }
//    function handleReset1() {
//		let i = commandStack.popAndUndoIfValid();
//		console.log("i: ", i);
//	}