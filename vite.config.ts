import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@domain': path.resolve(__dirname, './src/domain'),
      '@application': path.resolve(__dirname, './src/application'),
      '@infrastructure': path.resolve(__dirname, './src/infrastructure'),
      '@composition': path.resolve(__dirname, './src/composition'),
      '@ui': path.resolve(__dirname, './src/ui'),
      '@ds': path.resolve(__dirname, './src/ui/design-system'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
