import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    minify: 'esbuild',
    esbuild: {
      drop: ['console', 'debugger'],
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom', 'react-router'],
          'vendor-antd': ['antd', '@ant-design/icons'],
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
          'vendor-markdown': ['markdown-it', 'highlight.js', 'markdown-it-emoji', 'markdown-it-link-attributes'],
        },
      },
    },
  },
});
