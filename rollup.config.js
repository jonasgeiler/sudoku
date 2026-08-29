// rollup.config.js
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { writeFileSync } from 'fs';
import copy from 'rollup-plugin-copy';
import css from 'rollup-plugin-css-only';
import livereload from 'rollup-plugin-livereload';
import svelte from 'rollup-plugin-svelte';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';

const mode = process.env.NODE_ENV;
const production = mode === 'production';

const preprocess = sveltePreprocess({
  postcss: {
    plugins: [
      require('postcss-import'),
      require('tailwindcss'),
      require('autoprefixer'),
      // 生产环境下再做压缩
      ...(production ? [require('cssnano')({ preset: 'default' })] : []),
    ],
  },
  defaults: {
    style: 'postcss',
  },
});

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    sourcemap: !production,
    name: 'app',
    format: 'iife',
  },
  plugins: [
    copy({
      targets: [
        { src: 'src/template.html', dest: 'dist', rename: 'index.html' },
        { src: 'static/**/*', dest: 'dist' },
      ],
    }),

    svelte({
      // 禁用 Svelte 自带的 CSS 处理，让第三方插件接管
      emitCss: true,
      compilerOptions: {
        dev: !production,
        // giữ nguyên css để外部处理，不让 Svelte 去 minify
        css: false
      },
      preprocess,
    }),

    // 由这里统一打包所有 .svelte, .css 中的样式
    css({
      output: styles => {
        // 把 critical 和 bundle 拆开写
        writeFileSync('dist/bundle.css', styles);
      },
    }),

    resolve({
      browser: true,
      dedupe: ['svelte'],
    }),
    commonjs(),

    !production && serve(),
    !production && livereload('dist'),
    production && terser(),
  ],

  watch: {
    clearScreen: false,
  },
};

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require('child_process').spawn(
        'npm',
        ['run', 'start', '--', '--dev'],
        { stdio: ['ignore', 'inherit', 'inherit'], shell: true }
      );
      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    },
  };
}
