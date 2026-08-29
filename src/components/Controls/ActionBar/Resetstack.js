import { userGrid } from '@sudoku/stores/grid';
import { candidates } from '@sudoku/stores/candidates';
import { SUDOKU_SIZE } from '@sudoku/constants';
import { writable } from 'svelte/store';

// 回溯错误值
export let errorValue = {"number": undefined, "index": {}}; //number: int; index: {"x": 0, "y": 0}

// 命令栈
function createCommandStack() {
    const stack = writable([]);

    return {
        subscribe: stack.subscribe,

        canDo() {
            let result;
            stack.update($stack => {
                result = $stack.length != 0;
                return $stack;
            });
            return result;
        },

        clear() {
            stack.update(() => {
                return [];
            });
        },

        push(value) {
            stack.update($stack => {
                $stack.push(value);
                return $stack;
            });
        },

        pop() {
            let top_command;
            stack.update($stack => {
                if ($stack.length === 0)
                    return $stack;

                top_command = $stack[$stack.length - 1];
                $stack.pop();
                return $stack;
            });
            return top_command;
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
// 撤销恢复栈管理
function createStackManager() {
    let undostack = new createCommandStack();
    let redostack = new createCommandStack();

    return {

        pushCmd(cmd) {
            console.log("cmd: ", cmd);
            undostack.push(cmd);
            redostack.clear();
        },

        undo() {
            if (!undostack.canDo())
                return "";

            let undo_cmd = undostack.pop();
            let res = undo_cmd.undo();
            redostack.push(undo_cmd);
            console.log("undo done");
            return res;
        },

        redo() {
            if (!redostack.canDo())
                return "";

            let redo_cmd = redostack.pop();
            let res = redo_cmd.redo();
            undostack.push(redo_cmd);
            console.log("redo done");
            return res;
        },

        hasResetPoint() {
            // 检查栈中是否有ResetCommand
            let hasReset = false;
            undostack.subscribe(stack => {
                hasReset = stack.some(cmd => cmd.name === "ResetCommand");
            });
            return hasReset;
        }
    }
}
export const StackManager = createStackManager();

// "x, y" to {x, y}
function convertCandidateStringToObject(str) {
    console.log("str: ", str);
    const parts = str.split(',');
    if (parts.length !== 2) {
        return {};
    }
    const x = parseInt(parts[0], 10);
    const y = parseInt(parts[1], 10);
    return {x, y};
}

// 重置网格
export function resetUserGrid(grid) {
    for (let y = 0; y < SUDOKU_SIZE; y++) {
        for (let x = 0; x < SUDOKU_SIZE; x++) {
            userGrid.set({y, x}, grid[y][x]);
        }
    }
}

export function resetCandidates(candidates_bk){
    // 清空所有候选值
    for (let y = 0; y < SUDOKU_SIZE; y++) {
        for (let x = 0; x < SUDOKU_SIZE; x++) {
            candidates.clear({y, x});
        }
    }
    // 重置候选值
    for (let [key, value] of Object.entries(candidates_bk)) {
        let pos = convertCandidateStringToObject(key);
        candidates.clear(pos);
        for (let i of value)
            candidates.add(pos, i);
    }
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
        newCandidates[key] = [];
        for (let i = 0; i < value.length; i++) {
            newCandidates[key].push(value[i])
        }
    }
    return newCandidates;
}

// 回溯命令
export function ResetCommand(grid_bk, candidates_bk, try_number, cell_index){
    this.number = try_number;
    this.index = cell_index;
    this.grid_bk = grid_bk;
    this.candidates_bk = candidates_bk;
    this.name = "ResetCommand";

    this.undo = function(){
        console.log("ResetCommand undo");
        resetUserGrid(this.grid_bk);
        resetCandidates(this.candidates_bk);
        
        [errorValue["number"], this.number] = [this.number, errorValue["number"]];
        [errorValue["index"], this.index] = [this.index, errorValue["index"]];
        console.log("errorValue: ", errorValue);
        
        return this.name;
    };

    this.redo = function() {}
}

// 填写cell数字
export function SetValueCommand(grid_bk, candidates_bk, try_number, cell_index){
    this.number = try_number;
    this.index = cell_index;
    this.grid_bk = grid_bk;
    this.candidates_bk = candidates_bk;
    this.name = "SetValueCommand";

    this.undo = function(){
        console.log("SetvalueCommand undo");
        resetUserGrid(this.grid_bk);
        resetCandidates(this.candidates_bk);
        return this.name;
    };

    this.redo = function(){
        console.log("SetvalueCommand redo");
        userGrid.set(this.index, this.number);

        return this.name;
    }
}

// 填写note数字
export function SetNoteCommand(grid_bk, candidates_bk, try_number, cell_index){
    this.number = try_number;
    this.index = cell_index;
    this.grid_bk = grid_bk;
    this.candidates_bk = candidates_bk;
    this.name = "SetNoteCommand";

    this.undo = function(){
        console.log("SetNoteCommand undo");
        resetUserGrid(this.grid_bk);
        resetCandidates(this.candidates_bk);
        return this.name;
    };

    this.redo = function(){
        console.log("SetNoteCommand redo");
        candidates.add(this.index, this.number)
        return this.name;
    }
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