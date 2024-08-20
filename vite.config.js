import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: ["chrome87", "edge88", "es2020", "firefox78", "safari14"]
  },
});