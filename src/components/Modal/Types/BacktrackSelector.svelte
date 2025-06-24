<script>
    import { backtrack } from '@sudoku/stores/backtrack';
    import { userGrid, grid } from '@sudoku/stores/grid'; // 添加 grid 导入
    import { cursor } from '@sudoku/stores/cursor';
    import { candidates } from '@sudoku/stores/candidates';
    import { history } from '@sudoku/stores/history';  // 添加这一行
    import { get } from 'svelte/store';

    export let data = {};
    export let hideModal;
    
    const position = data.position;
    const branch = $backtrack.branchPoints[`${position.x},${position.y}`];
    
    // 使用分支点中存储的原始候选值列表
    const hintCandidates = branch?.candidates || [];
    const explanation = branch?.explanation || data.explanation;
    
    // 确保我们正确地比较已尝试的值
    $: remainingCandidates = hintCandidates.filter(c => 
        !branch?.attempts?.includes(Number(c))
    );

    function handleSelect(value) {
        if (position && branch) {
            const branchTimestamp = branch.timestamp;
            
            // 1. 收集所有用户填入的格子（非原始题目数字）
            const filledPositions = [];
            for (let y = 0; y < $userGrid.length; y++) {
                for (let x = 0; x < $userGrid[y].length; x++) {
                    if ($userGrid[y][x] !== 0 && $grid[y][x] === 0) {
                        filledPositions.push({x, y});
                    }
                }
            }

            // 2. 获取历史记录中每个格子最后一次填入的时间
            const latestFillTimes = new Map();
            
            // 2.1 先处理历史记录中的移动
            $history.past.forEach(move => {
                if (move.newValue !== 0) {
                    const key = `${move.position.x},${move.position.y}`;
                    latestFillTimes.set(key, move.timestamp);
                }
            });
            
            // 2.2 如果有当前移动，也加入考虑
            if ($history.current && $history.current.newValue !== 0) {
                const move = $history.current;
                const key = `${move.position.x},${move.position.y}`;
                latestFillTimes.set(key, move.timestamp);
            }

            // 3. 清除所有在分支点之后填入的格子
            filledPositions.forEach(pos => {
                const key = `${pos.x},${pos.y}`;
                const fillTime = latestFillTimes.get(key);
                
                // 如果找到填入时间并且晚于分支点，或者没找到填入时间（说明是最新操作）
                if (!fillTime || fillTime > branchTimestamp) {
                    userGrid.set(pos, 0);
                    candidates.clear(pos);
                }
            });

            // 4. 清空分支点之后的所有分支记录
            backtrack.clearAfter(position);
            
            // 5. 恢复到分支点
            cursor.set(position.x, position.y);
            
            // 6. 记录新的尝试
            backtrack.recordBranch(
                position,
                branch.candidates,
                Number(value),
                branch.explanation
            );

            // 7. 记录移动到历史
            const moveData = {
                position: {...position},
                oldValue: 0,
                newValue: Number(value),
                oldCandidates: null,
                newCandidates: null,
                timestamp: Date.now()
            };
            history.recordMove(moveData);
            
            // 8. 设置选中的值
            userGrid.set(position, Number(value));
            
            hideModal();
        }
    }
</script>

<div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-semibold leading-none">回溯选择</h1>
</div>

<div class="text-lg mb-4">
    第{position.y + 1}行第{position.x + 1}列的可选值：
</div>

<div class="mb-4">
    <div class="font-bold mb-2">提示策略：</div>
    <div class="text-gray-600 mb-4">{explanation}</div>
    
    <div class="font-bold">已尝试值：</div>
    <div class="text-gray-600">{branch?.attempts?.join(', ') || '无'}</div>
</div>

{#if remainingCandidates.length > 0}
    <div class="grid grid-cols-3 gap-2">
        {#each remainingCandidates as value}
            <button 
                class="btn p-4 text-xl"
                on:click={() => handleSelect(value)}>
                {value}
            </button>
        {/each}
    </div>
{:else}
    <p class="text-red-500">所有候选值都已尝试过，请使用提示功能查找其他可能的分支点。</p>
{/if}