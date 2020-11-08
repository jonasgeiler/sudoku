import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import url from '@rollup/plugin-url';
import path from 'path';
import svelte from 'rollup-plugin-svelte';
import { terser } from 'rollup-plugin-terser';
import config from 'sapper/config/rollup.js';
import sveltePreprocess from 'svelte-preprocess';
import pkg from './package.json';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const onwarn = (warning, onwarn) =>
	(warning.code === 'MISSING_EXPORT' && /'preload'/.test(warning.message)) ||
	(warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message)) ||
	onwarn(warning);

const preprocess = sveltePreprocess({
	postcss: {
		plugins: [
			require('postcss-import'),
			require('tailwindcss'),
			require('autoprefixer'),
			...(process.env.NODE_ENV === 'production' ? [require('postcss-clean')] : []),
		]
	},
	defaults: {
		style: 'postcss'
	}
});

export default {
	client: {
		input:   config.client.input(),
		output:  config.client.output(),
		plugins: [
			replace({
				'process.browser':      true,
				'process.env.NODE_ENV': JSON.stringify(mode),
			}),
			svelte({
				dev,
				hydratable: true,
				emitCss: false,
				preprocess
			}),
			url({
				sourceDir:  path.resolve(__dirname, 'src/node_modules/images'),
				publicPath: '/client/',
			}),
			resolve({
				browser: true,
				dedupe:  ['svelte'],
			}),
			commonjs(),

			legacy && babel({
				extensions:   ['.js', '.mjs', '.html', '.svelte'],
				babelHelpers: 'runtime',
				exclude:      ['node_modules/@babel/**'],
				presets:      [
					[
						'@babel/preset-env', {
						targets: '> 0.25%, not dead',
					},
					],
				],
				plugins:      [
					'@babel/plugin-syntax-dynamic-import',
					[
						'@babel/plugin-transform-runtime', {
						useESModules: true,
					},
					],
				],
			}),

			!dev && terser({
				module: true,
			}),
		],

		preserveEntrySignatures: false,
		onwarn,
	},

	server: {
		input:    config.server.input(),
		output:   config.server.output(),
		plugins:  [
			replace({
				'process.browser':      false,
				'process.env.NODE_ENV': JSON.stringify(mode),
			}),
			svelte({
				generate:   'ssr',
				hydratable: true,
				dev,
				emitCss: false,
				preprocess
			}),
			url({
				sourceDir:  path.resolve(__dirname, 'src/node_modules/images'),
				publicPath: '/client/',
				emitFiles:  false, // already emitted by client build
			}),
			resolve({
				dedupe: ['svelte'],
			}),
			commonjs(),
		],
		external: Object.keys(pkg.dependencies).concat(require('module').builtinModules),

		preserveEntrySignatures: 'strict',
		onwarn,
	},

	serviceworker: {
		input:   config.serviceworker.input(),
		output:  config.serviceworker.output(),
		plugins: [
			resolve(),
			replace({
				'process.browser':      true,
				'process.env.NODE_ENV': JSON.stringify(mode),
			}),
			commonjs(),
			!dev && terser(),
		],

		preserveEntrySignatures: false,
		onwarn,
	},
};
