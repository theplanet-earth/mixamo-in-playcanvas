import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'src',            // your HTML & TS still live here
  publicDir: '../public', // ← serve this folder at the site root
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/index.html')
    }
  },
  server: {
    port: 8080,
    open: true
  }
});
