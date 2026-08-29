// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';

// 如果你还没有 svelte.config.js，可以直接在这里把预处理写好；
// 否则你也可以把 preprocess 配置放到独立的 svelte.config.js 里，然后下面引用它
const preprocess = sveltePreprocess({
  // 启用 PostCSS 8
  postcss: true,
  // 根据需要启用其它预处理（如 SCSS、TypeScript 等）
  // scss: true,
  // typescript: true,
});

export default defineConfig({
  plugins: [
    svelte({
      preprocess,
      compilerOptions: {
        // 强制生成 DOM 版本，避免 SSR 相关错误
        generate: 'dom'
      }
    })
  ],

  resolve: {
    alias: {
      // 把 @sudoku 指向 src/sudoku 目录（把 @sudoku 包的源码移到这里）
      '@sudoku': path.resolve(__dirname, 'src/sudoku')
    }
  },

  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage',
      // 只统计 src/utils 下的 .js 业务代码
      include: ['src/utils/**/*.js'],
      // 排除非业务文件
      exclude: [
        'node_modules/**',
        'scripts/**',
        '**/*.config.js',
        'rollup.config.js',
        'tailwind.config.js',
        'src/main.js',
        'src/App.svelte',
        'src/components/**',
        'src/utils/candidateHelpers.js'
      ],
      // 覆盖率门槛
      lines: 75,
      functions: 80,
      branches: 70
    }
  }
});
