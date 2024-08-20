import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: ['web', 'es2022', 'esnext'],
  },
});