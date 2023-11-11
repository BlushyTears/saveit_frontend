import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import preprocess from 'svelte-preprocess';

export default {
  preprocess: vitePreprocess({
    // ... other preprocess options
    scss: {
      includePaths: ['src'],
    },
    // you can include other preprocessors like postcss, globalStyle here if needed
  }),
}