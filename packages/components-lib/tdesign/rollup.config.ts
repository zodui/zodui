import autoprefixer from 'autoprefixer'
import type { RollupOptions } from 'rollup'
import skip from 'rollup-helper/plugins/skip'
import externalResolver from 'rollup-helper/utils/externalResolver'
import globalResolver from 'rollup-helper/utils/globalResolver'
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

let globals = {}

const exportsEntries = {
  index: 'src/index.ts',
  react: 'src/react/index.tsx'
}

const dependencies = new Set([])

export default [
  {
    input: exportsEntries,
    output: [
      {
        ...commonOutputOptions,
        format: 'esm',
        entryFileNames: '[name].esm.js',
        preserveModules: true
      }
    ],
    plugins: [
      {
        resolveId(id) {
          if (external.some(dep => dep instanceof RegExp ? dep.test(id) : dep === id)) {
            dependencies.add(id)
            return { id, external: true }
          }
          return null
        },
        outputOptions(options) {
          globals = [...dependencies].reduce((acc, value) => ({
            ...acc,
            [value]: globalResolver(value)
          }), {})
          return { ...options, globals }
        }
      },
      skip({ patterns: [/\.s?css$/] }),
      esbuild()
    ]
  },
  ...Object.entries(exportsEntries).map(([name, input]) => ({
    input: input,
    output: [
      {
        ...commonOutputOptions,
        name: 'ZodUIComponentsLibTDesign' + name === 'index' ? '' : (
          name[0].toUpperCase() + name.slice(1)
        ),
        format: 'iife',
        entryFileNames: '[name].iife.js'
      },
      {
        ...commonOutputOptions,
        name: 'ZodUIComponentsLibTDesign' + name === 'index' ? '' : (
          name[0].toUpperCase() + name.slice(1)
        ),
        format: 'umd',
        entryFileNames: '[name].umd.js'
      }
    ],
    plugins: [
      {
        outputOptions: (options: any) => ({ ...options, globals })
      },
      postcss({
        plugins: [autoprefixer],
        minimize: true,
        sourceMap: true,
        extract: `${name}.css`
      }),
      esbuild()
    ],
    external
  })),
  {
    input: exportsEntries,
    output: {
      dir: 'dist',
      entryFileNames: ({ name }) => `${name.replace(/^src\//, '')}.d.ts`,
      preserveModules: true
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
