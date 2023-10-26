// @ts-check
import { defineConfig } from 'rollup'
import autoprefixer from 'autoprefixer'
import esbuild from 'rollup-plugin-esbuild'
import postcss from 'rollup-plugin-postcss'

import pkg from './package.json' assert { type: 'json' }

const commonOutputOptions = {
  dir: 'dist',
  exports: 'named',
  sourcemap: true
}

export default defineConfig({
  input: 'src/index.ts',
  output: [
    {
      ...commonOutputOptions,
      format: 'esm',
      entryFileNames: '[name].esm.js'
    },
    {
      ...commonOutputOptions,
      format: 'iife',
      entryFileNames: '[name].iife.js'
    },
    {
      ...commonOutputOptions,
      name: 'ZodReact',
      format: 'umd',
      entryFileNames: '[name].umd.js'
    }
  ],
  plugins: [
    postcss({
      plugins: [autoprefixer],
      minimize: true,
      sourceMap: true,
      extract: 'index.css'
    }),
    esbuild({
      tsconfig: './tsconfig.build.json'
    })
  ],
  external: Object
    .keys(pkg.dependencies)
    .concat('@zodui/core')
})
