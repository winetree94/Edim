import { defineConfig } from 'tsup';

export default defineConfig({
  target: 'es2018',
  entry: [
    'src/index.ts',
    'src/italic/index.ts',
    'src/code/index.ts',
    'src/font-family/index.ts',
    'src/strikethrough/index.ts',
    'src/bold/index.ts',
    'src/subscript/index.ts',
    'src/superscript/index.ts',
    'src/text-color/index.ts',
    'src/underline/index.ts',
  ],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: false,
  clean: true,
});
