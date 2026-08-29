<script>
    import { DIFFICULTIES } from '@sudoku/constants';
    import { grid } from '@sudoku/stores/grid';
    import game from '@sudoku/game';

    export let hideModal;
    export let sencode = '';
    export let difficulty = 1;

    // 修改验证逻辑：判断是否为有效的81位数字
    function isInputValid() {
        const input = sencode.trim();
        // 如果输入为空，允许用户选择难度开始游戏
        if (input === '') {
            return true;
        }
        // 检查是否为81位数字
        return input.length === 81 && /^[0-9]+$/.test(input);
    }

    // 实时更新按钮状态
    $: buttonDisabled = !isInputValid();

    function handleStart() {
        const input = sencode.trim();
        
        if (input.length === 81 && /^[0-9]+$/.test(input)) {
            console.log("开始自定义题目");
            // 使用新添加的 importString 方法
            grid.importString(input);
            hideModal();
        } else {
            console.log("开始新游戏，难度:", difficulty);
            hideModal();
            game.startNew(difficulty);
        }
    }
</script>

<div class="modal-content">
    <h2 class="modal-title">欢迎来到数独</h2>
    <div class="mb-3">
        <label for="sencode" class="block mb-1">输入自定义题目（81位数字，0代表空格）</label>
        <input 
            id="sencode" 
            class="input font-mono mb-5" 
            bind:value={sencode} 
            type="text" 
            placeholder="输入81位数字，0代表空格"
        />
        <div class="text-xs text-gray-500 mb-2">
            例如：003020600900305001001806400008102900700000008006708200002609500800203009005010300
        </div>
    </div>
    <div class="mb-3">
        <label for="difficulty" class="block mb-1">选择难度</label>
        <select id="difficulty" class="input" bind:value={difficulty}>
            {#each Object.entries(DIFFICULTIES) as [key, label]}
                <option value={key}>{label}</option>
            {/each}
        </select>
    </div>
    <div class="modal-actions">
        <button 
            class="btn btn-small btn-primary" 
            disabled={buttonDisabled} 
            on:click={handleStart}
        >
            Start
        </button>
        <button class="btn btn-small" on:click={hideModal}>取消</button>
    </div>
</div>