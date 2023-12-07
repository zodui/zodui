import autoprefixer from 'autoprefixer'
import { resolve } from 'path'
import { getWorkspaceDir } from 'pnpm-helper/getWorkspaceDir'
import type { RollupOptions } from 'rollup'
import { createGlobalsLinkage } from 'rollup-helper/plugins/globals'
import skip from 'rollup-helper/plugins/skip'
import { commonOutputOptions } from 'rollup-helper/utils/commonOptions'
import externalResolver from 'rollup-helper/utils/externalResolver'
import copy from 'rollup-plugin-copy'
import { dts } from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'
import postcss from 'rollup-plugin-postcss'

const workspaceRoot = getWorkspaceDir()
function resolveWorkspacePath(p: string) {
  return resolve(workspaceRoot, p)
}
const [globalsRegister, globalsOutput] = createGlobalsLinkage()

const external = externalResolver()

const exportsEntries = {
  index: 'src/index.ts',
  react: 'src/react/index.tsx'
}

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
      globalsRegister({ external }),
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
        entryFileNames: `${name}.iife.js`
      },
      {
        ...commonOutputOptions,
        name: 'ZodUIComponentsLibTDesign' + name === 'index' ? '' : (
          name[0].toUpperCase() + name.slice(1)
        ),
        format: 'umd',
        entryFileNames: `${name}.umd.js`
      }
    ],
    plugins: [
      globalsOutput,
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
      dts({ tsconfig: resolveWorkspacePath('tsconfig.dts.json') }),
      copy({
        targets: [
          { src: 'src/react.fix.d.ts', dest: 'dist' }
        ]
      })
    ],
    external
  }
] as RollupOptions[]
