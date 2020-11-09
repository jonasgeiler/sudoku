import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import copy from 'rollup-plugin-copy';

const mode = process.env.NODE_ENV;
const production = mode === 'production';

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true,
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		},
	};
}

const preprocess = sveltePreprocess({
	postcss:  {
		plugins: [
			require('postcss-import'),
			require('tailwindcss'),
			require('autoprefixer'),
			...(production ? [require('postcss-clean')] : []),
		],
	},
	defaults: {
		style: 'postcss',
	},
});

export default {
	input:   'src/main.js',
	output:  {
		file:      'dist/bundle.js',
		sourcemap: !production,
		format:    'iife',
		name:      'app',
	},
	plugins: [
		copy({
			targets: [
				{ src: 'src/template.html', dest: 'dist', rename: 'index.html' },
				{ src: 'static/**/*', dest: 'dist' },
			],
		}),

		svelte({
			// enable run-time checks when not in production
			dev: !production,

			css: css => {
				if (production) {
					// First line of code is global css, let's consider this as "critical css" and extract it
					const lines = css.code.split('\n');
					const criticalCss = lines.shift();
					css.emit('bundle.css', lines.join('\n'));
					css.emit('critical.css', criticalCss);
				} else {
					// In dev mode just write everything into the bundled css
					css.write('bundle.css');
				}
			},

			// preprocess svelte files
			preprocess,
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe:  ['svelte'],
		}),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `dist` directory and refresh the
		// browser on changes when not in production
		!production && livereload('dist'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),
	],
	watch:   {
		clearScreen: false,
	},
};
