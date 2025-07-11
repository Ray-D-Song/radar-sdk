import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      formats: ['iife'],
      name: 'RadarAnalytics',
      fileName: (format) => `index.${format}.js`,
      entry: 'index.ts',
    },
  },
});
