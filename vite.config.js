import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  root: "renderer",
  plugins: [
    svelte({
      preprocess: sveltePreprocess()
    })
  ],
  build: {
    sourcemap: false,
    outDir: "app"
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer()
      ]
    }
  }
})