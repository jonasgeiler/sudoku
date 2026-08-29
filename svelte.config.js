// svelte.config.js
import sveltePreprocess from 'svelte-preprocess';

export default {
  preprocess: sveltePreprocess({
    // 如果你需要 PostCSS，就保留这一行；不需要就设为 false
    postcss: true,
    // 其它预处理选项举例：
    // scss: true,
    // typescript: true,
  })
};
