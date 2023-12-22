import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    sourcemap: true
  },
  resolve: {
    alias: [{
      find: /^@edim-editor\/(.*)$/,
      replacement: path.resolve('../$1/src'),
    }]
  }
});
