import autoprefixer from 'autoprefixer'
import type { RollupOptions } from 'rollup'
import skip from 'rollup-helper/plugins/skip'
import externalResolver from 'rollup-helper/utils/externalResolver'
import copy from 'rollup-plugin-copy'
import { dts } from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'
import postcss from 'rollup-plugin-postcss'

const commonOutputOptions = {
  dir: 'dist',
  exports: 'named',
  sourcemap: true
}

const external = externalResolver()

export default [
  {
    input: ['src/index.ts', 'src/react.tsx'],
    output: [
      {
        ...commonOutputOptions,
        format: 'esm',
        entryFileNames: '[name].esm.js'
      }
    ],
    plugins: [
      postcss({
        plugins: [autoprefixer],
        minimize: true,
        sourceMap: true,
        extract: 'index.css'
      }),
      esbuild()
    ],
    external
  },
  {
    input: 'src/index.ts',
    output: [
      {
        ...commonOutputOptions,
        format: 'iife',
        entryFileNames: '[name].iife.js'
      },
      {
        ...commonOutputOptions,
        name: 'ZodUIComponentsLibTDesign',
        format: 'umd',
        entryFileNames: '[name].umd.js'
      }
    ],
    plugins: [
      skip({ patterns: [/\.s?css$/] }),
      esbuild()
    ],
    external
  },
  {
    input: ['src/index.ts', 'src/react.tsx'],
    output: {
      dir: 'dist',
      entryFileNames: ({ name }) => `${name.replace(/^src\//, '')}.d.ts`
    },
    plugins: [
      skip({ patterns: [/\.s?css$/] }),
      dts({ tsconfig: './tsconfig.dts.json' }),
      copy({
        targets: [
          { src: 'src/react.fix.d.ts', dest: 'dist' }
        ]
      })
    ],
    external
  }
] as RollupOptions[]
