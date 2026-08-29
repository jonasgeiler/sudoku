import { settings } from './settings';
import { writable } from 'svelte/store';
import { SUDOKU_SIZE } from '../constants';

export const usedHints = writable(0);

function createHints() {
    let defaultHints = Infinity;

    const hints = writable(Infinity);

    settings.subscribe(($settings) => {
        if ($settings.hintsLimited) {
            defaultHints = $settings.hints;
            hints.update($hints => {
                if ($hints > $settings.hints) return $settings.hints;

                return $hints;
            })
        } else {
            defaultHints = Infinity;
            hints.set(Infinity);
        }
    });

    return {
        subscribe: hints.subscribe,

        use() {
            hints.update($hints => {
                if ($hints > 0) {
                    usedHints.update($usedHints => $usedHints + 1);
                    return $hints - 1;
                }

                return 0;
            });
        },

        reset() {
            hints.set(defaultHints);
            usedHints.set(0);
        }
    };
}

export const hints = createHints();

// 策略库
export const strategies = {
    // 1. 基础策略 - 唯一数字法
    singleCandidate: {
        name: "唯一数字法",
        description: "当一个格子只有一个可能的数字时使用",
        check: (grid, x, y, candidates) => {
            if (candidates.length === 1) {
                return {
                    strategy: "singleCandidate",
                    value: candidates[0],
                    explanation: `在第${y + 1}行第${x + 1}列的格子中只能填入数字 ${candidates[0]}，因为其他数字都与已填数字冲突。`
                };
            }
            return null;
        }
    },

    // 2. 基础策略 - 唯一位置法
    hiddenSingle: {
        name: "唯一位置法",
        description: "当某个数字在行、列或九宫格中只能放在一个位置时使用",
        check: (grid, x, y, candidates, allCandidates) => {
            for (const num of candidates) {
                // 检查行
                let uniqueInRow = true;
                for (let i = 0; i < SUDOKU_SIZE; i++) {
                    if (i !== x && grid[y][i] === 0) {
                        const key = `${i},${y}`;
                        if (allCandidates[key]?.includes(num)) {
                            uniqueInRow = false;
                            break;
                        }
                    }
                }
                if (uniqueInRow) {
                    return {
                        strategy: "hiddenSingle",
                        value: num,
                        explanation: `在第${y + 1}行中，数字 ${num} 只能放在第${x + 1}列，因为其他位置都不能填入该数字。`
                    };
                }

                // 检查列
                let uniqueInCol = true;
                for (let i = 0; i < SUDOKU_SIZE; i++) {
                    if (i !== y && grid[i][x] === 0) {
                        const key = `${x},${i}`;
                        if (allCandidates[key]?.includes(num)) {
                            uniqueInCol = false;
                            break;
                        }
                    }
                }
                if (uniqueInCol) {
                    return {
                        strategy: "hiddenSingle",
                        value: num,
                        explanation: `在第${x + 1}列中，数字 ${num} 只能放在第${y + 1}行，因为其他位置都不能填入该数字。`
                    };
                }

                // 检查九宫格
                const boxStartX = Math.floor(x / 3) * 3;
                const boxStartY = Math.floor(y / 3) * 3;
                let uniqueInBox = true;
                for (let i = 0; i < 3 && uniqueInBox; i++) {
                    for (let j = 0; j < 3; j++) {
                        const checkX = boxStartX + j;
                        const checkY = boxStartY + i;
                        if ((checkX !== x || checkY !== y) && grid[checkY][checkX] === 0) {
                            const key = `${checkX},${checkY}`;
                            if (allCandidates[key]?.includes(num)) {
                                uniqueInBox = false;
                                break;
                            }
                        }
                    }
                }
                if (uniqueInBox) {
                    return {
                        strategy: "hiddenSingle",
                        value: num,
                        explanation: `在第${Math.floor(y/3) + 1}宫中，数字 ${num} 只能放在第${y + 1}行第${x + 1}列，因为其他位置都不能填入该数字。`
                    };
                }
            }
            return null;
        }
    },

    // 3. 中级策略 - 数对法
    nakedPair: {
        name: "数对法",
        description: "当两个格子的候选数相同且只有两个数字时使用",
        check: (grid, x, y, candidates, allCandidates) => {
            if (candidates.length !== 2) return null;

            // 检查行中的数对
            let pairFoundInRow = false;
            let pairX = -1;
            for (let i = 0; i < SUDOKU_SIZE; i++) {
                if (i !== x && grid[y][i] === 0) {
                    const key = `${i},${y}`;
                    const otherCandidates = allCandidates[key] || [];
                    if (arraysEqual(candidates, otherCandidates)) {
                        pairFoundInRow = true;
                        pairX = i;
                        break;
                    }
                }
            }

            if (pairFoundInRow) {
                return {
                    strategy: "nakedPair",
                    value: null,
                    candidates: candidates,
                    explanation: `在第${y + 1}行的第${x + 1}列和第${pairX + 1}列找到数对 ${candidates.join(',')}，这意味着这两个数字只能出现在这两个格子中。`
                };
            }

            return null;
        }
    }
};

// 工具函数
function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
}

// 获取单元格的候选数字
export function getCandidates(grid, x, y) {
    if (grid[y][x] !== 0) return [];
    
    const used = new Set();
    
    // 检查行
    for (let i = 0; i < SUDOKU_SIZE; i++) {
        if (grid[y][i] !== 0) used.add(grid[y][i]);
    }
    
    // 检查列
    for (let i = 0; i < SUDOKU_SIZE; i++) {
        if (grid[i][x] !== 0) used.add(grid[i][x]);
    }
    
    // 检查九宫格
    const boxX = Math.floor(x / 3) * 3;
    const boxY = Math.floor(y / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[boxY + i][boxX + j] !== 0) {
                used.add(grid[boxY + i][boxX + j]);
            }
        }
    }
    
    return Array.from({length: SUDOKU_SIZE}, (_, i) => i + 1).filter(n => !used.has(n));
}

// 获取所有格子的候选数字
export function getAllCandidates(grid) {
    const allCandidates = {};
    for (let y = 0; y < SUDOKU_SIZE; y++) {
        for (let x = 0; x < SUDOKU_SIZE; x++) {
            if (grid[y][x] === 0) {
                allCandidates[`${x},${y}`] = getCandidates(grid, x, y);
            }
        }
    }
    return allCandidates;
}

// 查找候选值最少的格子（使之更完善）
function findMinCandidatesCell(grid) {
    const allCandidates = getAllCandidates(grid);
    let bestX = null;
    let bestY = null;
    let minCandidates = 10;
    
    for (let y = 0; y < SUDOKU_SIZE; y++) {
        for (let x = 0; x < SUDOKU_SIZE; x++) {
            if (grid[y][x] === 0) {
                const candidates = allCandidates[`${x},${y}`] || [];
                if (candidates.length > 0 && candidates.length < minCandidates) {
                    minCandidates = candidates.length;
                    bestX = x;
                    bestY = y;
                }
            }
        }
    }
    
    if (bestX !== null) {
        const candidates = allCandidates[`${bestX},${bestY}`];
        return {
            strategy: "candidates",
            x: bestX,
            y: bestY,
            candidates: candidates,
            explanation: `在第${bestY + 1}行第${bestX + 1}列的格子中可以填入的数字有：${candidates.join(', ')}\n\n这是候选值最少的格子，找到正确答案的可能性更高。`
        };
    }
    
    // 如果所有格子都有数字，返回null
    return null;
}

// 查找下一步提示
export function findNextHint(grid, x, y) {
    console.log('Finding hint for position:', x, y);
    const allCandidates = getAllCandidates(grid);
    
    // 如果指定了特定格子，先检查该格子
    if (x !== null && y !== null && grid[y][x] === 0) {
        const cellCandidates = allCandidates[`${x},${y}`] || [];
        if (cellCandidates.length === 0) {
            return null;
        }
        
        // 按策略优先级尝试求解
        for (const [strategyName, strategy] of Object.entries(strategies)) {
            const result = strategy.check(grid, x, y, cellCandidates, allCandidates);
            if (result) {
                console.log(`Strategy ${strategyName} found solution:`, result);
                return {
                    ...result,
                    x,
                    y,
                    candidates: cellCandidates
                };
            }
        }
        
        // 如果没有找到确定的策略，返回候选数
        return {
            strategy: "candidates",
            x,
            y,
            candidates: cellCandidates,
            explanation: `在第${y + 1}行第${x + 1}列的格子中可以填入的数字有：${cellCandidates.join(', ')}\n\n请继续观察数字分布规律，尝试找出确定的答案。`
        };
    }
    
    // 没有指定格子或指定格子已填，寻找可填入格子
    
    // 步骤1：寻找唯一数字格子（只有一个候选值）
    for (let i = 0; i < SUDOKU_SIZE; i++) {
        for (let j = 0; j < SUDOKU_SIZE; j++) {
            if (grid[i][j] === 0) {
                const candidates = allCandidates[`${j},${i}`] || [];
                if (candidates.length === 1) {
                    return {
                        strategy: "singleCandidate",
                        x: j,
                        y: i,
                        value: candidates[0],
                        candidates: candidates,
                        explanation: `在第${i + 1}行第${j + 1}列的格子中只能填入数字 ${candidates[0]}，因为其他数字都与已填数字冲突。`
                    };
                }
            }
        }
    }
    
    // 步骤2：寻找唯一位置
    for (let i = 0; i < SUDOKU_SIZE; i++) {
        for (let j = 0; j < SUDOKU_SIZE; j++) {
            if (grid[i][j] === 0) {
                const candidates = allCandidates[`${j},${i}`] || [];
                
                // 检查唯一位置
                for (const num of candidates) {
                    // 检查行唯一性
                    let uniqueInRow = true;
                    for (let k = 0; k < SUDOKU_SIZE; k++) {
                        if (k !== j && grid[i][k] === 0) {
                            const key = `${k},${i}`;
                            if (allCandidates[key]?.includes(num)) {
                                uniqueInRow = false;
                                break;
                            }
                        }
                    }
                    
                    if (uniqueInRow) {
                        return {
                            strategy: "hiddenSingle",
                            x: j,
                            y: i,
                            value: num,
                            candidates: candidates,
                            explanation: `在第${i + 1}行中，数字 ${num} 只能放在第${j + 1}列，因为其他位置都不能填入该数字。`
                        };
                    }
                    
                    // 检查列唯一性
                    let uniqueInCol = true;
                    for (let k = 0; k < SUDOKU_SIZE; k++) {
                        if (k !== i && grid[k][j] === 0) {
                            const key = `${j},${k}`;
                            if (allCandidates[key]?.includes(num)) {
                                uniqueInCol = false;
                                break;
                            }
                        }
                    }
                    
                    if (uniqueInCol) {
                        return {
                            strategy: "hiddenSingle",
                            x: j,
                            y: i,
                            value: num,
                            candidates: candidates,
                            explanation: `在第${j + 1}列中，数字 ${num} 只能放在第${i + 1}行，因为其他位置都不能填入该数字。`
                        };
                    }
                    
                    // 检查九宫格唯一性
                    const boxStartX = Math.floor(j / 3) * 3;
                    const boxStartY = Math.floor(i / 3) * 3;
                    let uniqueInBox = true;
                    
                    for (let r = 0; r < 3 && uniqueInBox; r++) {
                        for (let c = 0; c < 3; c++) {
                            const checkX = boxStartX + c;
                            const checkY = boxStartY + r;
                            if ((checkX !== j || checkY !== i) && grid[checkY][checkX] === 0) {
                                const key = `${checkX},${checkY}`;
                                if (allCandidates[key]?.includes(num)) {
                                    uniqueInBox = false;
                                    break;
                                }
                            }
                        }
                    }
                    
                    if (uniqueInBox) {
                        return {
                            strategy: "hiddenSingle",
                            x: j,
                            y: i,
                            value: num,
                            candidates: candidates,
                            explanation: `在第${Math.floor(i/3) + 1}宫中，数字 ${num} 只能放在第${i + 1}行第${j + 1}列，因为其他位置都不能填入该数字。`
                        };
                    }
                }
                
                // 检查数对
                if (candidates.length === 2) {
                    // 检查行中的数对
                    let pairFoundInRow = false;
                    let pairX = -1;
                    for (let k = 0; k < SUDOKU_SIZE; k++) {
                        if (k !== j && grid[i][k] === 0) {
                            const key = `${k},${i}`;
                            const otherCandidates = allCandidates[key] || [];
                            if (arraysEqual(candidates, otherCandidates)) {
                                pairFoundInRow = true;
                                pairX = k;
                                break;
                            }
                        }
                    }
                    
                    if (pairFoundInRow) {
                        return {
                            strategy: "nakedPair",
                            x: j,
                            y: i,
                            candidates: candidates,
                            explanation: `在第${i + 1}行的第${j + 1}列和第${pairX + 1}列找到数对 ${candidates.join(',')}，这意味着这两个数字只能出现在这两个格子中。`
                        };
                    }
                }
            }
        }
    }
    
    // 步骤3：如果没有找到确定的策略，返回候选值最少的格子
    return findMinCandidatesCell(grid);
}