import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/features': path.resolve(__dirname, './src/Features'),
      '@/components': path.resolve(__dirname, './src/Components'),
      '@/pages': path.resolve(__dirname, './src/Pages'),
      '@/hooks': path.resolve(__dirname, './src/Hooks'),
      '@/utils': path.resolve(__dirname, './src/Utils'),
      '@/types': path.resolve(__dirname, './src/Types'),
      '@/constants': path.resolve(__dirname, './src/Constants'),
      '@/redux': path.resolve(__dirname, './src/redux'),
      '@/api': path.resolve(__dirname, './src/api'),
      '@/config': path.resolve(__dirname, './src/config'),
      '@/providers': path.resolve(__dirname, './src/providers'),
      '@/routes': path.resolve(__dirname, './src/routes'),
      '@/dummyJson': path.resolve(__dirname, './src/dummyJson'),
      '@/styles': path.resolve(__dirname, './src/styles'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});