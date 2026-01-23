<!-- InputModal.svelte - 优化版 -->
<script>
	export let data = {
		title: 'Input Required',
		placeholder: 'Please enter value...',
		button: 'Submit',
		cancelButton: 'Cancel',
		value: '',
		required: false,
		validator: null
	};
	
	export let hideModal;
	
	let inputValue = data.value || '';
	let error = '';
	let inputRef;
	
	// 自动聚焦到输入框
	import { onMount } from 'svelte';
	onMount(() => {
		if (inputRef) {
			inputRef.focus();
			inputRef.select();
		}
	});
	
	// 响应式验证
	$: if (inputValue !== undefined) {
		validateInput();
	}
	
	function validateInput() {
		error = '';
		
		if (data.required && !inputValue.trim()) {
			error = 'This field is required';
			return false;
		}
		
		if (data.validator && typeof data.validator === 'function') {
			const validationResult = data.validator(inputValue);
			if (validationResult !== true) {
				error = validationResult || 'Invalid input';
				return false;
			}
		}
		
		return true;
	}
	
	function handleSubmit() {
		if (!validateInput()) return;
		
		if (data.callback) {
			// console.log(inputValue);
			
			data.callback(inputValue);
		}
		hideModal();
	}
	
	function handleKeydown(event) {
		if (event.key === 'Enter') {
			event.preventDefault();
			handleSubmit();
		}
		
		if (event.key === 'Escape') {
			event.preventDefault();
			handleCancel();
		}
	}
	
	function handleCancel() {
		if (data.onCancel) {
			data.onCancel();
		}
		hideModal();
	}
</script>

<div class="modal-wrapper" on:click|self={handleCancel}>
	<div class="modal-card">
		<!-- 标题区域 -->
		<div class="modal-header">
			<h2 class="modal-title">
				{data.title || 'Input Required'}
			</h2>
			<button class="close-button" on:click={handleCancel} aria-label="Close">
				×
			</button>
		</div>
		
		<!-- 内容区域 -->
		<div class="modal-body">
			{#if data.description}
				<p class="modal-description">
					{data.description}
				</p>
			{/if}
			
			<div class="input-wrapper">
				<input
					bind:this={inputRef}
					type="text"
					bind:value={inputValue}
					placeholder={data.placeholder || 'Please enter url...'}
					on:keydown={handleKeydown}
					class="modal-input {error ? 'error' : ''}"
					aria-invalid={!!error}
					aria-describedby={error ? 'input-error' : ''}
				/>
				
				{#if error}
					<div id="input-error" class="error-message">
						{error}
					</div>
				{/if}
				
				{#if data.hint}
					<div class="input-hint">
						{data.hint}
					</div>
				{/if}
			</div>
		</div>
		
		<!-- 按钮区域 -->
		<div class="modal-footer">
			<button
				class="btn btn-secondary"
				on:click={handleCancel}
				type="button"
			>
				{data.cancelButton || 'Cancel'}
			</button>
			
			<button
				class="btn btn-primary {data.required && !inputValue.trim() ? 'disabled' : ''}"
				on:click={handleSubmit}
				type="button"
				disabled={data.required && !inputValue.trim()}
			>
				{data.button || 'Submit'}
			</button>
		</div>
	</div>
</div>

<style>
	/* 模态框遮罩 */
	.modal-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 20px;
		animation: fadeIn 0.2s ease-out;
	}
	
	/* 模态框卡片 */
	.modal-card {
		background: white;
		border-radius: 12px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
		width: 100%;
		max-width: 450px;
		animation: slideUp 0.3s ease-out;
		overflow: hidden;
	}
	
	/* 暗色模式 */
	:global(.dark) .modal-card {
		background: #1e293b;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	}
	
	/* 标题区域 */
	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20px 24px;
		border-bottom: 1px solid #e5e7eb;
	}
	
	:global(.dark) .modal-header {
		border-bottom-color: #374151;
	}
	
	.modal-title {
		font-size: 20px;
		font-weight: 600;
		color: #111827;
		margin: 0;
	}
	
	:global(.dark) .modal-title {
		color: #f9fafb;
	}
	
	.close-button {
		background: none;
		border: none;
		font-size: 24px;
		color: #6b7280;
		cursor: pointer;
		padding: 0;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 6px;
		transition: all 0.2s;
	}
	
	.close-button:hover {
		background: #f3f4f6;
		color: #111827;
	}
	
	:global(.dark) .close-button {
		color: #9ca3af;
	}
	
	:global(.dark) .close-button:hover {
		background: #374151;
		color: #f9fafb;
	}
	
	/* 内容区域 */
	.modal-body {
		padding: 24px;
	}
	
	.modal-description {
		font-size: 15px;
		color: #6b7280;
		margin: 0 0 16px 0;
		line-height: 1.5;
	}
	
	:global(.dark) .modal-description {
		color: #9ca3af;
	}
	
	.input-wrapper {
		margin-top: 8px;
	}
	
	.modal-input {
		width: 100%;
		padding: 12px 16px;
		font-size: 16px;
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		background: white;
		color: #111827;
		transition: all 0.2s;
		box-sizing: border-box;
	}
	
	.modal-input:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}
	
	.modal-input.error {
		border-color: #ef4444;
	}
	
	.modal-input.error:focus {
		box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
	}
	
	:global(.dark) .modal-input {
		background: #111827;
		border-color: #4b5563;
		color: #f9fafb;
	}
	
	:global(.dark) .modal-input:focus {
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
	}
	
	/* 错误提示 */
	.error-message {
		color: #ef4444;
		font-size: 14px;
		margin-top: 6px;
		display: flex;
		align-items: center;
		gap: 4px;
	}
	
	:global(.dark) .error-message {
		color: #fca5a5;
	}
	
	/* 输入提示 */
	.input-hint {
		color: #6b7280;
		font-size: 13px;
		margin-top: 6px;
		line-height: 1.4;
	}
	
	:global(.dark) .input-hint {
		color: #9ca3af;
	}
	
	/* 按钮区域 */
	.modal-footer {
		padding: 20px 24px;
		border-top: 1px solid #e5e7eb;
		display: flex;
		justify-content: flex-end;
		gap: 12px;
	}
	
	:global(.dark) .modal-footer {
		border-top-color: #374151;
	}
	
	/* 按钮样式 */
	.btn {
		padding: 10px 20px;
		font-size: 14px;
		font-weight: 500;
		border-radius: 8px;
		border: none;
		cursor: pointer;
		transition: all 0.2s;
		line-height: 1.4;
	}
	
	.btn-primary {
		background: #3b82f6;
		color: white;
	}
	
	.btn-primary:hover:not(:disabled) {
		background: #2563eb;
		transform: translateY(-1px);
	}
	
	.btn-primary:disabled,
	.btn-primary.disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
	}
	
	.btn-secondary {
		background: #f3f4f6;
		color: #374151;
	}
	
	.btn-secondary:hover {
		background: #e5e7eb;
	}
	
	:global(.dark) .btn-secondary {
		background: #374151;
		color: #d1d5db;
	}
	
	:global(.dark) .btn-secondary:hover {
		background: #4b5563;
	}
	
	/* 动画 */
	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	
	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>