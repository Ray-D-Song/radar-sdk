import { defineConfig } from "@rslib/core";

export default defineConfig({
  lib: [
    { 
      format: 'iife', 
      syntax: 'es2017'
    },
  ],
  output: {
    target: 'web',
  },
  source: {
    entry: {
      main: './index.ts'
    }
  },
  tools: {
    rspack: {
      output: {
        library: {
          type: 'umd',
          name: 'RadarAnalytics',
          export: 'default'
        }
      }
    }
  }
})
