<script>
    import game from '@sudoku/game';
    import { validateSencode } from '@sudoku/sencode';
    import { modal } from '@sudoku/stores/modal';
    import { slide, fade } from 'svelte/transition';
    import { DIFFICULTIES, DROPDOWN_DURATION, DIFFICULTY_CUSTOM } from '@sudoku/constants';
    import { difficulty } from '@sudoku/stores/difficulty';
    import { grid } from '@sudoku/stores/grid';

    let dropdownVisible = false;




    function handleDifficulty(difficultyValue) {
        dropdownVisible = false;
        game.pause();

        modal.show('confirm', {
            title: 'New Game',
            text: 'Start new game with difficulty "' + DIFFICULTIES[difficultyValue] + '"?',
            button: 'Continue',
            onHide: game.resume,
            callback: () => {
                game.startNew(difficultyValue);
            },
        });
    }



    function extractBdFromUrl(str) {
        try {
            const url = new URL(str);
            if (url.hostname === "www.sudokuwiki.org" && url.searchParams.get("bd")) {
                return url.searchParams.get("bd");
            }
        } catch (e) {}
        return null;
    }

    // 导入题目的具体实现
    function importWikiPuzzle(str) {
        if (!str || str.length !== 81 || !/^[0-9]+$/.test(str)) {
            modal.show('confirm', {
                title: '导入失败',
                text: '题目格式不正确！',
                button: '确定'
            });
            return;
        }
        
        if (grid.importString(str)) {
            modal.show('confirm', {
                title: '导入成功',
                text: '题目已导入！',
                button: '开始'
            });
        }
    }

    function handleImportWiki() {
        dropdownVisible = false;
        game.pause();

        modal.show('prompt', {
            title: '导入SudokuWiki题目',
            text: '请粘贴SudokuWiki题目字符串（81位数字，0代表空格），或直接粘贴SudokuWiki网址：',
            fontMono: true,
            button: '导入',
            onHide: game.resume,
            callback: (value) => {
                const bd = extractBdFromUrl(value);
                if (bd && bd.length === 81) {
                    importWikiPuzzle(bd);
                } else {
                    importWikiPuzzle(value);
                }
            },
            validate: (value) => {
                const bd = extractBdFromUrl(value);
                return (value && value.length === 81 && /^[0-9]+$/.test(value)) || (bd && bd.length === 81);
            }
        });
    }

    function showDropdown() {
        dropdownVisible = true;
        game.pause();
    }

    function hideDropdown() {
        dropdownVisible = false;
        setTimeout(game.resume, DROPDOWN_DURATION);
    }
</script>

<div class="dropdown">
    <button class="dropdown-button" on:click={dropdownVisible ? hideDropdown : showDropdown} title="{dropdownVisible ? 'Close' : 'Open'} Menu">
        <svg class="icon-outline mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h12" />
        </svg>

        <span class="text-2xl tracking-wider">{$difficulty === DIFFICULTY_CUSTOM ? 'Custom' : DIFFICULTIES[$difficulty]}</span>
    </button>

    {#if dropdownVisible}
        <button transition:fade={{duration: DROPDOWN_DURATION}} class="dropdown-overlay" on:click={hideDropdown} tabindex="-1"></button>

        <div transition:slide={{duration: DROPDOWN_DURATION}} class="dropdown-menu">
            {#each Object.entries(DIFFICULTIES) as [difficultyValue, difficultyLabel]}
                <a class="dropdown-item" on:click|preventDefault={() => handleDifficulty(difficultyValue)} href="/difficulty-{difficultyValue}" title="Set difficulty to '{difficultyLabel}'">
                    <svg class="icon-solid" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>

                    <span class="align-middle">{difficultyLabel}</span>
                </a>
            {/each}

            <hr class="my-1">

            <a class="dropdown-item" on:click|preventDefault={handleImportWiki} href="/import-wiki" title="导入SudokuWiki题目">
                <svg class="icon-solid" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4 3a1 1 0 011-1h10a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V3zm2 2v10h8V5H6z" clip-rule="evenodd" />
                </svg>
                <span class="align-middle">导入SudokuWiki题目</span>
            </a>
        </div>
    {/if}
</div>

<style>
    .dropdown {
        @apply relative;
    }

    .dropdown-button {
        @apply relative z-30 block flex outline-none items-center;
    }

    .dropdown-overlay {
        @apply fixed z-20 inset-0 h-full w-full bg-black bg-opacity-50 outline-none cursor-default;
    }

    .dropdown-menu {
        @apply absolute z-30 left-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl;
    }

    .dropdown-item {
        @apply block px-4 py-2 text-gray-800 transition-colors duration-100 text-lg tracking-wide font-semibold;
    }

    .dropdown-item:hover {
        @apply bg-primary text-white;
    }

    .dropdown-item:active {
        @apply bg-primary-dark;
    }
</style>