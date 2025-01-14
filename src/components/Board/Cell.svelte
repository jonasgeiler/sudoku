<script>
	import Candidates from './Candidates.svelte';
	import { fade } from 'svelte/transition';
	import { SUDOKU_SIZE } from '@sudoku/constants';
	import { cursor } from '@sudoku/stores/cursor';
	import { userGrid } from '@sudoku/stores/grid';
	import { kStore } from '@sudoku/stores/simpleStrategy'
	import { candidates as Candidate } from '@sudoku/stores/candidates';
	import { stateManager } from '@sudoku/stores/stateManager';

	export let value;
	export let cellX;
	export let cellY;
	export let candidates;

	export let disabled;
	export let conflictingNumber;
	export let userNumber;
	export let selected;
	export let sameArea;
	export let sameNumber;

	const borderRight = (cellX !== SUDOKU_SIZE && cellX % 3 !== 0);
	const borderRightBold = (cellX !== SUDOKU_SIZE && cellX % 3 === 0);
	const borderBottom = (cellY !== SUDOKU_SIZE && cellY % 3 !== 0);
	const borderBottomBold = (cellY !== SUDOKU_SIZE && cellY % 3 === 0);

	export let hint = 0; // 新增：提示数字

	function fillHint(hint) {
		// 更新 userGrid 填入提示数字
		if (hint.length === 1) {
			// 如果 hint 数组长度为 1，执行操作
			const value = hint[0]; // 提取数组中的唯一值
			userGrid.sethint(cellX - 1, cellY - 1, value);
			Candidate.syncWithStrategy();

			stateManager.add_state(userGrid.get());
			console.log('hint input');
			console.log(userGrid.get());
			console.log(stateManager.get_state_dict());
		}
		cursor.set(cellX - 1, cellY - 1);

	}
</script>

<div class="cell row-start-{cellY} col-start-{cellX}"
	 class:border-r={borderRight}
	 class:border-r-4={borderRightBold}
	 class:border-b={borderBottom}
	 class:border-b-4={borderBottomBold}>

	{#if !disabled}
		<div class="cell-inner"
			 class:user-number={userNumber}
			 class:selected={selected}
			 class:same-area={sameArea}
			 class:same-number={sameNumber}
			 class:conflicting-number={conflictingNumber}>

			{#if hint && !value }
				<!-- 显示提示数字 -->
				<button class="cell-btn hint-btn" on:click={() => fillHint(hint)}>
					{#if hint.length === 1}
						<span class="hint-number">{hint}</span>
					{:else if hint.length <= kStore.get() }
						<Candidates {candidates} />
					{/if}
				</button>
			{:else}
				<!-- 显示原有候选数字或当前值 -->
				<button class="cell-btn" on:click={() => cursor.set(cellX - 1, cellY - 1)}>
					{#if candidates}
						<Candidates {candidates} />
					{:else}
						<span class="cell-text">{value || ''}</span>
					{/if}
				</button>
			{/if}
		</div>
	{/if}

</div>

<style>
	.cell {
		@apply h-full w-full row-end-auto col-end-auto;
	}

	.cell-inner {
		@apply relative h-full w-full text-gray-800;
	}

	.cell-btn {
		@apply absolute inset-0 h-full w-full;
	}

	.cell-btn:focus {
		@apply outline-none;
	}

	.cell-text {
		@apply leading-full text-base;
	}

	.hint-number{
		@apply text-yellow-600;
	}

	@media (min-width: 300px) {
		.cell-text {
			@apply text-lg;
		}
	}

	@media (min-width: 350px) {
		.cell-text {
			@apply text-xl;
		}
	}

	@media (min-width: 400px) {
		.cell-text {
			@apply text-2xl;
		}
	}

	@media (min-width: 500px) {
		.cell-text {
			@apply text-3xl;
		}
	}

	@media (min-width: 600px) {
		.cell-text {
			@apply text-4xl;
		}
	}

	.user-number {
		@apply text-primary;
	}

	.selected {
		@apply bg-primary text-white;
	}

	.same-area {
		@apply bg-primary-lighter;
	}

	.same-number {
		@apply bg-primary-light;
	}

	.conflicting-number {
		@apply text-red-600;
	}
</style>