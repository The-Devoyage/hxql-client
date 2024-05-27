import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/hxql.cjs.js',
      format: 'cjs',
    },
    {
      file: 'dist/hxql.esm.js',
      format: 'esm',
    },
    {
      file: 'dist/hxql.umd.js',
      format: 'umd',
      name: 'hxql',
    },
    {
      file: 'dist/hxql.umd.min.js',
      format: 'umd',
      name: 'hxql',
      plugins: [terser()],
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' })
  ],
};
