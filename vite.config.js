import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: "es2022",
  },
  server: {
    fs: {
      strict: false,
    },
    publicDir: 'public',
    base: './',
    
  },
});