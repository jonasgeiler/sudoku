<!-- 应用的主组件，负责组织和渲染整个应用的结构。
其他组件（如 Header、Footer）通常会嵌套在这里。
 	-->

<script>
	import { onMount } from 'svelte';   // 生命周期函数，类似于 React 的 componentDidMount，在组件首次挂载时运行。
	import { validateSencode } from '@sudoku/sencode'; //  验证数独编码的函数，判断 URL 哈希值是否有效。
	import game from '@sudoku/game';
	import { modal } from '@sudoku/stores/modal'; // 一个 Store，用于管理模态框的状态。
	import { gameWon } from '@sudoku/stores/game';
	import Board from './components/Board/index.svelte'; // 数独棋盘组件。
	import Controls from './components/Controls/index.svelte';  // 数独控制区域组件（如键盘输入）
	import Header from './components/Header/index.svelte'; // 页面头部组件
	import Modal from './components/Modal/index.svelte'; // 模态框组件

	gameWon.subscribe(won => {
		if (won) {
			game.pause();
			modal.show('gameover');
		}
	});

	// 执行一些初始化逻辑——这些初始逻辑是用来加载分享链接的。
	// eg：https://sudoku.jonasgeiler.com/#o6DZ2hbDBoCZT-3pwX9CkdOTG69r
	// 项目执行入口点
	onMount(() => {
		let hash = location.hash;

		if (hash.startsWith('#')) {
			hash = hash.slice(1);
		}

		let sencode;
		if (validateSencode(hash)) {
			sencode = hash;
		}


		modal.show('welcome', { onHide: game.resume, sencode });
	});
</script>

<!-- Timer, Menu, etc. -->
<header>
	<Header />
</header>

<!-- Sudoku Field -->
<section>
	<Board />
</section>

<!-- Keyboard -->
<footer>
	<Controls />
</footer>

<Modal />

<style global>
	@import "./styles/global.css";
</style>