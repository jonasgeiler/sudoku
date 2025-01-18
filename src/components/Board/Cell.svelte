<script>
	import Candidates from './Candidates.svelte';
	import { fade } from 'svelte/transition';
	import { SUDOKU_SIZE } from '@sudoku/constants';
	import { cursor } from '@sudoku/stores/cursor';
	import { hintStore } from '@sudoku/stores/hintStore'; // 导入 hintStore
	import { userGrid } from '@sudoku/stores/grid';
	import { sudokutreemanager } from "@sudoku/stores/state";
	import { hintText } from '@sudoku/stores/hints'; // 导入 hintText
	import { reasons_list } from '@sudoku/stores/hints'; // 导入 reasons_list
	import { get } from 'svelte/store'; //导入 svelte 的 get 方法

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

	// 用于存储所有提示内容
	let allHints = [];

	// 订阅 hintStore，获取所有提示数据
	hintStore.subscribe(hints => {
		allHints = hints; // 保存整个 hintStore 列表
	});

	function handleCellClick() {
		cursor.set(cellX - 1, cellY - 1);
		// 查找是否有提示与当前单元格匹配
		const matchingHint = allHints.find(hint => hint.x === cellX - 1 && hint.y === cellY - 1);
		let hintval = 0;
		if (matchingHint) {
			// 如果找到匹配的提示，将提示的值填入 userGrid 对应位置
			if (matchingHint.value.length === 1) {
				hintval = matchingHint.value[0];
				userGrid.set({ x: cellX - 1, y: cellY - 1 }, hintval);
			}
			else {
				sudokutreemanager.pushToStack();
			}

			// 如果找到匹配的提示，才设置显示提示的原因
			let reasons = get(reasons_list); // 提取 writable 的当前值
			console.log("reasons:",reasons);
			const matchingReason = reasons[cellY-1][cellX-1];
			console.log("cellX-1:",cellX-1,"cellY-1:",cellY-1,"matchingReason:",matchingReason);
			if (matchingReason && matchingReason.length) {
				hintText.set(matchingReason[0]);
				console.log(matchingReason[0]);
			}

		} else {
			hintText.set("");
		}

		// 清空 hintStore 的内容
		hintStore.clear();
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

			<button class="cell-btn" on:click={handleCellClick}>
				{#if candidates}
					<Candidates {candidates} />
				{:else}
					<span class="cell-text">{value || ''}</span>
				{/if}

				{#each allHints as hint}
					{#if hint.x === cellX-1  && hint.y === cellY-1 }
						<div class="hint-grid grid grid-cols-3 grid-rows-3 gap-0.5 p-0.5 absolute inset-0">
							{#each hint.value as val}
								<div class="hint-value">
									{val}
								</div>
							{/each}
						</div>
					{/if}
				{/each}
			</button>


		</div>
	{/if}
</div>

<style>
	.cell {
		@apply h-full w-full row-end-auto col-end-auto;
	}

	.cell-btn {
		@apply absolute inset-0 h-full w-full;
	}

	.hint-grid {
		width: 90%;
		height: 90%;
		top: 5%;
		left: 5%;
	}

	.hint-value {
		@apply flex items-center justify-center text-white bg-green-500 rounded-sm text-xs;
		aspect-ratio: 1 / 1; /* 确保每个小提示格是正方形 */
	}


	/*.hint-values {*/
	/*	@apply absolute inset-0 flex flex-wrap items-center justify-center gap-1 p-1;*/
	/*}*/

	/*.hint-value {*/
	/*	@apply flex items-center justify-center text-white bg-green-500 rounded-lg text-sm w-6 h-6;*/
	/*}*/

	.cell-inner {
		@apply relative h-full w-full text-gray-800;
	}



	.cell-btn:focus {
		@apply outline-none;
	}

	.cell-text {
		@apply leading-full text-base;
	}

	@media (min-width: 300px) {
		.cell-text {
			@apply text-lg;
		}
		.hint-value {
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

