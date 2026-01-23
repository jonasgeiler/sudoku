<!-- SudokuModal.svelte -->
<script>
	export let data = {};
	export let hideModal;

	// 难度常量
	const DIFFICULTIES = {
		veryeasy: 'Very Easy',
		easy:     'Easy',
		medium:   'Medium',
		hard:     'Hard',
	};
	
	// 状态管理
	let selectedCell = null;
	let showNumberPicker = false;
	let numberPickerPosition = { x: 0, y: 0 };
	let selectedDifficulty = data.defaultDifficulty || 'veryeasy';
	
	// 数独网格数据 - 从初始字符串创建，或初始化为空
	let sudokuGrid = Array(9).fill().map(() => Array(9).fill(''));
	let initialSequence = data.initialSequence || '';
	
	// 用户填写的位置记录（用于验证和清除）
	let userFilledPositions = new Set();
	
	// 错误高亮
	let errorCells = new Set();
	
	// 初始化网格
	function initializeGrid() {
		if (initialSequence && initialSequence.length === 81) {
			for (let i = 0; i < 81; i++) {
				const row = Math.floor(i / 9);
				const col = i % 9;
				const char = initialSequence[i];
				sudokuGrid[row][col] = char === '0' || char === '.' ? '' : char;
				if (sudokuGrid[row][col]) {
					userFilledPositions.add(`${row},${col}`);
				}
			}
		}
	}
	
	initializeGrid();
	
	// 获取当前的一维序列
	function getCurrentSequence() {
		let sequence = '';
		for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				const value = sudokuGrid[row][col];
				sequence += value || '0';
			}
		}
		return sequence;
	}
	
	// 处理单元格点击
	function handleCellClick(row, col, event) {
		// 如果是已预设的单元格（来自初始序列且不是用户填写的），不能编辑
		if (initialSequence && 
			initialSequence[row * 9 + col] !== '0' && 
			initialSequence[row * 9 + col] !== '.' &&
			!userFilledPositions.has(`${row},${col}`)) {
			return;
		}
		
		selectedCell = { row, col };
		const rect = event.target.getBoundingClientRect();
		
		// 计算数字选择器的位置
		const pickerSize = 160;
		let left = rect.left + rect.width / 2 - pickerSize / 2;
		let top = rect.bottom + 10;
		
		// 确保选择器不会超出视口
		if (top + pickerSize > window.innerHeight) {
			top = rect.top - pickerSize - 10;
		}
		if (left + pickerSize > window.innerWidth) {
			left = window.innerWidth - pickerSize - 10;
		}
		if (left < 10) {
			left = 10;
		}
		
		numberPickerPosition = { x: left, y: top };
		showNumberPicker = true;
		
		// 隐藏其他数字选择器
		errorCells.clear();
	}
	
	// 选择数字
	function selectNumber(number) {
		if (selectedCell) {
			const { row, col } = selectedCell;
			sudokuGrid[row][col] = number.toString();
			userFilledPositions.add(`${row},${col}`);
			showNumberPicker = false;
			selectedCell = null;
		}
	}
	
	// 清除当前单元格
	function clearCurrentCell() {
		if (selectedCell && userFilledPositions.has(`${selectedCell.row},${selectedCell.col}`)) {
			const { row, col } = selectedCell;
			sudokuGrid[row][col] = '';
			userFilledPositions.delete(`${row},${col}`);
			showNumberPicker = false;
			selectedCell = null;
		}
	}
	
	// 取消选择
	function cancelSelection() {
		showNumberPicker = false;
		selectedCell = null;
		errorCells.clear();
	}
	
	// 验证数独
	function validateSudoku() {
		errorCells.clear();
		let isValid = true;
		
		// 验证行
		for (let row = 0; row < 9; row++) {
			const seen = new Set();
			for (let col = 0; col < 9; col++) {
				const value = sudokuGrid[row][col];
				if (value) {
					if (seen.has(value)) {
						isValid = false;
						for (let c = 0; c < 9; c++) {
							if (sudokuGrid[row][c] === value) {
								errorCells.add(`${row},${c}`);
							}
						}
					}
					seen.add(value);
				}
			}
		}
		
		// 验证列
		for (let col = 0; col < 9; col++) {
			const seen = new Set();
			for (let row = 0; row < 9; row++) {
				const value = sudokuGrid[row][col];
				if (value) {
					if (seen.has(value)) {
						isValid = false;
						for (let r = 0; r < 9; r++) {
							if (sudokuGrid[r][col] === value) {
								errorCells.add(`${r},${col}`);
							}
						}
					}
					seen.add(value);
				}
			}
		}
		
		// 验证 3x3 宫格
		for (let blockRow = 0; blockRow < 3; blockRow++) {
			for (let blockCol = 0; blockCol < 3; blockCol++) {
				const seen = new Set();
				for (let i = 0; i < 3; i++) {
					for (let j = 0; j < 3; j++) {
						const row = blockRow * 3 + i;
						const col = blockCol * 3 + j;
						const value = sudokuGrid[row][col];
						if (value) {
							if (seen.has(value)) {
					  isValid = false;
						// 标记整个宫格的重复数字
						for (let x = 0; x < 3; x++) {
							for (let y = 0; y < 3; y++) {
								const r = blockRow * 3 + x;
								const c = blockCol * 3 + y;
								if (sudokuGrid[r][c] === value) {
									errorCells.add(`${r},${c}`);
								}
							}
						}
					}
					seen.add(value);
				}
			}
		}
			}
		}
		
		return isValid;
	}
	
	// 确认提交
	function handleConfirm() {
		if (validateSudoku()) {
			const sequence = getCurrentSequence();
			if (data.callback) {
				data.callback({
					valid: true,
					sequence: sequence,
					grid: sudokuGrid,
					difficulty: selectedDifficulty,
					difficultyText: DIFFICULTIES[selectedDifficulty],
					message: 'Sudoku is valid!'
				});
			}
			hideModal();
		} else {
			// 显示错误，但不关闭模态框
			if (data.callback) {
				data.callback({
					valid: false,
					sequence: getCurrentSequence(),
					grid: sudokuGrid,
					difficulty: selectedDifficulty,
					difficultyText: DIFFICULTIES[selectedDifficulty],
					message: 'Invalid Sudoku. Please fix the errors.'
				});
			}
		}
	}
	
	// 取消
	function handleCancel() {
		if (data.onHide) {
			data.onHide();
		}
		hideModal();
	}
	
	// 键盘事件处理
	import { onMount } from 'svelte';
	
	onMount(() => {
		function handleKeydown(event) {
			if (showNumberPicker && selectedCell) {
				const key = event.key;
				if (key >= '1' && key <= '9') {
					event.preventDefault();
					selectNumber(parseInt(key));
				} else if (key === 'Escape') {
					event.preventDefault();
					cancelSelection();
				} else if (key === 'Backspace' || key === 'Delete') {
					event.preventDefault();
					clearCurrentCell();
				}
			}
		}
		
		document.addEventListener('keydown', handleKeydown);
		
		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});
	
	// 点击外部关闭数字选择器
	function handleOutsideClick(event) {
		if (showNumberPicker && !event.target.closest('.number-picker')) {
			cancelSelection();
		}
	}
</script>

<div class="sudoku-modal-overlay" on:click={hideModal}>
	<div class="sudoku-modal-content" on:click|stopPropagation>
		<h1 class="text-3xl font-semibold mb-6 leading-none text-center">
			{data.title || 'Sudoku Puzzle'}
		</h1>
		
		{#if data.text}
			<p class="text-lg mb-8 text-center text-gray-600">
				{data.text}
			</p>
		{/if}
		
		<!-- 数独网格 -->
		<div class="sudoku-grid-container mb-8">
			<div class="sudoku-grid">
				{#each sudokuGrid as row, rowIndex}
					{#each row as cell, colIndex}
						{@const isPreset = initialSequence && 
							initialSequence[rowIndex * 9 + colIndex] !== '0' && 
							initialSequence[rowIndex * 9 + colIndex] !== '.' &&
							!userFilledPositions.has(`${rowIndex},${colIndex}`)}
						{@const hasError = errorCells.has(`${rowIndex},${colIndex}`)}
						{@const isSelected = selectedCell && 
							selectedCell.row === rowIndex && 
							selectedCell.col === colIndex}
						
						<div 
							class="sudoku-cell"
							class:border-t-thick={rowIndex % 3 === 0 && rowIndex !== 0}
							class:border-l-thick={colIndex % 3 === 0 && colIndex !== 0}
							class:preset-cell={isPreset}
							class:error-cell={hasError}
							class:selected-cell={isSelected}
							on:click={(e) => handleCellClick(rowIndex, colIndex, e)}
							on:keydown
						>
							{#if cell}
								<span class="cell-value" class:preset-value={isPreset}>
									{cell}
								</span>
							{/if}
						</div>
					{/each}
				{/each}
			</div>
		</div>
		
		<!-- 数字选择器 -->
		{#if showNumberPicker && selectedCell}
			<div 
				class="number-picker"
				style="position: fixed; left: {numberPickerPosition.x}px; top: {numberPickerPosition.y}px;"
				on:click|stopPropagation
			>
				<div class="number-grid">
					{#each Array.from({ length: 9 }, (_, i) => i + 1) as number}
						<button
							class="number-btn"
							on:click={() => selectNumber(number)}
						>
							{number}
						</button>
					{/each}
				</div>
				<div class="number-picker-actions">
					<button
						class="clear-btn"
						on:click={clearCurrentCell}
						disabled={!userFilledPositions.has(`${selectedCell.row},${selectedCell.col}`)}
					>
						Clear
					</button>
					<button class="cancel-btn" on:click={cancelSelection}>
						Cancel
					</button>
				</div>
			</div>
		{/if}
		
		<!-- 底部按钮和难度选择 -->
		<div class="sudoku-modal-footer">
			<div class="difficulty-selector">
				<label for="difficulty-select" class="difficulty-label">
					Difficulty:
				</label>
				<select
					id="difficulty-select"
					bind:value={selectedDifficulty}
					class="difficulty-select"
				>
					{#each Object.entries(DIFFICULTIES) as [key, label]}
						<option value={key}>
							{label}
						</option>
					{/each}
				</select>
			</div>
			
			<div class="sudoku-modal-actions">
				<button 
					class="btn btn-secondary"
					on:click={handleCancel}
				>
					{data.cancelText || 'Cancel'}
				</button>
				<button 
					class="btn btn-primary"
					on:click={handleConfirm}
				>
					{data.button || 'Confirm'}
				</button>
			</div>
		</div>
		
		<!-- 当前序列显示（调试用） -->
		{#if data.showSequence}
			<div class="sequence-display mt-4 p-3 bg-gray-100 rounded text-xs font-mono">
				<div class="text-sm font-semibold mb-1">Current Sequence:</div>
				{getCurrentSequence()}
			</div>
		{/if}
	</div>
</div>

<style>
	.sudoku-modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 20px;
		backdrop-filter: blur(2px);
	}
	
	.sudoku-modal-content {
		background: white;
		border-radius: 16px;
		padding: 32px;
		max-width: 500px;
		width: 100%;
		max-height: 90vh;
		overflow-y: auto;
		box-shadow: 0 25px 75px rgba(0, 0, 0, 0.4);
	}
	
	/* 数独网格样式 */
	.sudoku-grid-container {
		display: flex;
		justify-content: center;
	}
	
	.sudoku-grid {
		display: grid;
		grid-template-columns: repeat(9, 1fr);
		grid-template-rows: repeat(9, 1fr);
		gap: 0;
		width: 360px;
		height: 360px;
		border: 2px solid #333;
		border-radius: 4px;
		overflow: hidden;
	}
	
	.sudoku-cell {
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid #ccc;
		background-color: white;
		cursor: pointer;
		transition: all 0.2s;
		font-size: 20px;
		font-weight: bold;
		position: relative;
		user-select: none;
	}
	
	.sudoku-cell:hover {
		background-color: #f0f9ff;
	}
	
	.sudoku-cell.selected-cell {
		background-color: #dbeafe;
	}
	
	.sudoku-cell.preset-cell {
		background-color: #f5f5f5;
		cursor: default;
	}
	
	.sudoku-cell.error-cell {
		background-color: #fee2e2;
	}
	
	.sudoku-cell.border-t-thick {
		border-top: 3px solid #666;
	}
	
	.sudoku-cell.border-l-thick {
		border-left: 3px solid #666;
	}
	
	.cell-value {
		font-size: 24px;
		color: #2563eb;
	}
	
	.cell-value.preset-value {
		color: #111;
		font-weight: 600;
	}
	
	/* 数字选择器样式 */
	.number-picker {
		background: white;
		border-radius: 12px;
		padding: 15px;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
		border: 2px solid #e5e7eb;
		z-index: 1001;
	}
	
	.number-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(3, 1fr);
		gap: 8px;
		margin-bottom: 12px;
	}
	
	.number-btn {
		width: 40px;
		height: 40px;
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		background: white;
		font-size: 18px;
		font-weight: bold;
		color: #2563eb;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.number-btn:hover {
		background-color: #eff6ff;
		border-color: #2563eb;
		transform: translateY(-2px);
	}
	
	.number-picker-actions {
		display: flex;
		gap: 8px;
		justify-content: center;
	}
	
	.clear-btn,
	.cancel-btn {
		padding: 6px 12px;
		border-radius: 6px;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		border: none;
		transition: all 0.2s;
	}
	
	.clear-btn {
		background-color: #f3f4f6;
		color: #374151;
	}
	
	.clear-btn:hover:not(:disabled) {
		background-color: #e5e7eb;
	}
	
	.clear-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	
	.cancel-btn {
		background-color: #6b7280;
		color: white;
	}
	
	.cancel-btn:hover {
		background-color: #4b5563;
	}
	
	/* 底部区域样式 */
	.sudoku-modal-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 24px;
		padding-top: 16px;
		border-top: 1px solid #e5e7eb;
	}
	
	/* 难度选择器样式 */
	.difficulty-selector {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	
	.difficulty-label {
		font-size: 14px;
		font-weight: 500;
		color: #4b5563;
		white-space: nowrap;
	}
	
	.difficulty-select {
		padding: 8px 12px;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		background-color: white;
		font-size: 14px;
		color: #111;
		cursor: pointer;
		transition: all 0.2s;
		min-width: 120px;
	}
	
	.difficulty-select:hover {
		border-color: #9ca3af;
	}
	
	.difficulty-select:focus {
		outline: none;
		border-color: #2563eb;
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
	}
	
	/* 按钮样式 */
	.sudoku-modal-actions {
		display: flex;
		gap: 12px;
	}
	
	.btn {
		padding: 10px 24px;
		border-radius: 8px;
		font-size: 16px;
		font-weight: 500;
		cursor: pointer;
		border: none;
		transition: all 0.2s;
		min-width: 100px;
	}
	
	.btn-primary {
		background-color: #2563eb;
		color: white;
	}
	
	.btn-primary:hover {
		background-color: #1d4ed8;
		transform: translateY(-1px);
	}
	
	.btn-secondary {
		background-color: #f3f4f6;
		color: #374151;
	}
	
	.btn-secondary:hover {
		background-color: #e5e7eb;
		transform: translateY(-1px);
	}
	
	.sequence-display {
		word-break: break-all;
		line-height: 1.4;
	}
	
	/* 响应式调整 */
	@media (max-width: 640px) {
		.sudoku-modal-footer {
			flex-direction: column;
			gap: 16px;
			align-items: stretch;
		}
		
		.difficulty-selector {
			justify-content: space-between;
		}
		
		.sudoku-modal-actions {
			justify-content: flex-end;
		}
		
		.sudoku-grid {
			width: 300px;
			height: 300px;
		}
		
		.cell-value {
			font-size: 20px;
		}
	}
</style>