import App from './App.svelte';

const app = new App({
	target: document.getElementById('app')
});

export default app;


//	项目的主入口文件。
//  负责将 App.svelte 挂载到 index.html 中的根元素（如 <div id="app">）。

// TODO: Warn when hint not possible
// TODO: Undo/Redo
// TODO: Import sudoku
// TODO: Creator mode
// TODO: Bug hunt
// TODO: Announce