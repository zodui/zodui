// @ts-check
import { defineConfig } from 'rollup'
import autoprefixer from 'autoprefixer'
import { dts } from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'
import postcss from 'rollup-plugin-postcss'

import pkg from './package.json' assert { type: 'json' }

const commonOutputOptions = {
  dir: 'dist',
  exports: 'named',
  sourcemap: true
}

const external = Object
  .keys(pkg.dependencies)
  .concat(/@zodui\/core\/.*/)

export default defineConfig([
  {
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
      esbuild()
    ],
    external
  },
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist'
    },
    plugins: [
      {
        transform(code, id) {
          if (id.endsWith('.scss')) {
            return { code: `export default undefined`, map: null }
          }
        }
      },
      dts({ tsconfig: './tsconfig.dts.json' }),
      {
        generateBundle(options, bundle) {
          let lastExportLine = ''
          for (let i = bundle['index.d.ts'].code.length - 2; i >= 0; i--) {
            if (bundle['index.d.ts'].code[i] === '\n') {
              lastExportLine = bundle['index.d.ts'].code.slice(i + 1)
              break
            }
          }
          // pick type export from index.d.ts
          // export { type A, B, type C }
          const typeExports = [
            ...lastExportLine.matchAll(/type (\w+)(?:, )?/g)
          ].map(([, type]) => type)
          const typeExportLine = typeExports
            .reduce(
              (acc, type, index) => `${acc}${index > 0 ? ', ' : ''}${type}`,
              'export type { '
            )
            .concat(' };\n')
          // add type export to index.d.ts
          lastExportLine = lastExportLine.replace(
            /type (\w+)(?:, )?/g,
            ''
          )
          lastExportLine = typeExportLine + lastExportLine
          bundle['index.d.ts'].code = bundle['index.d.ts'].code.replace(
            /export \{.*};\n/,
            lastExportLine
          )
        }
      }
    ],
    external
  }
])
