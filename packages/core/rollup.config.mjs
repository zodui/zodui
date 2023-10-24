// @ts-check
import { defineConfig } from 'rollup'
import JSONPlugin from '@rollup/plugin-json'
import esbuild from 'rollup-plugin-esbuild'

import pkg from './package.json' assert { type: 'json' }

const input = Object.entries(pkg.exports)
  .reduce((acc, [key, value]) => {
    if (key.endsWith('.json')) return acc

    key = key.replace(/^\.\//, '')
    const type = typeof value

    switch (type) {
      case 'string':
        acc[
          key === '.'
            ? 'index'
            : key
          ] = value
        break
      case 'object':
        if (value.import) {
          acc[
            key === '.'
              ? 'index'
              : key
            ] = value['inner-src']
        }
        break
    }
    return acc
  }, {})

export default defineConfig({
  input,
  output: [
    {
      dir: 'dist',
      format: 'esm',
      exports: 'named',
      sourcemap: true,
      entryFileNames: ({ name }) => {
        const nameAlias = name === 'index' ? '.' : `./${name}`
        const { import: importField } = pkg.exports[nameAlias]
        if (importField) {
          return 'esm/[name].js'
        }
        return '.ignore'
      }
    },
    {
      dir: 'dist',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
      entryFileNames: ({ name }) => {
        const nameAlias = name === 'index' ? '.' : `./${name}`
        const { require: requireField } = pkg.exports[nameAlias]
        if (requireField) {
          return 'cjs/[name].js'
        }
        return '.ignore'
      }
    },
  ],
  plugins: [
    JSONPlugin(),
    esbuild({
      tsconfig: './tsconfig.build.json'
    })
  ],
  external: Object.keys(pkg.dependencies)
})
