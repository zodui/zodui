import fs from 'node:fs'
import { resolve } from 'node:path'

import autoprefixer from 'autoprefixer'
import { getWorkspaceDir } from 'pnpm-helper/getWorkspaceDir'
import type { InputPluginOption, RollupOptions } from 'rollup'
import { createGlobalsLinkage } from 'rollup-helper/plugins/globals'
import skip from 'rollup-helper/plugins/skip'
import { commonOutputOptions } from 'rollup-helper/utils/commonOptions'
import externalResolver from 'rollup-helper/utils/externalResolver'
import { dts } from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'
import postcss from 'rollup-plugin-postcss'

const workspaceRoot = getWorkspaceDir()
function resolveWorkspacePath(p: string) {
  return resolve(workspaceRoot, p)
}

const pkgJson = JSON.parse(fs.readFileSync(resolve(process.cwd(), 'package.json'), 'utf-8')) as {
  name: string
  exports?: Record<string, {
    import: string
    'inner-src': string
  }>
}
const namePrefix = pkgJson
  .name
  .replace(/[@|/-](\w)/g, (_, $1) => $1.toUpperCase())
const exportsEntriesFromPkgJSON = Object.fromEntries(
  Object.entries(pkgJson.exports ?? {})
    // filter static files
    .filter(([key]) => !/\.(json|css|scss)$/.test(key))
    // filter no `inner-src` or `import` field entries
    .filter(([, value]) => value['inner-src'] && value['import'])
    .map(([key, value]) => [
      key
        .replace(/^\.$/, 'index')
        .replace(/^\.\//, ''),
      value['inner-src']
    ])
)

export default (
  {
    styled = false,
    plugins: {
      index: indexPlugins = [],
      entry: entryPlugins = [],
      dts: dtsPlugins = []
    } = {}
  }: {
    /**
     * include styles files
     */
    styled?: boolean
    plugins?: {
      index?: InputPluginOption
      entry?: InputPluginOption
      dts?: InputPluginOption
    }
  } = {},
  exportsEntries: Record<string, string> = exportsEntriesFromPkgJSON
) => {
  const [globalsRegister, globalsOutput] = createGlobalsLinkage()
  const external = externalResolver()

  return [
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
        styled && skip({ patterns: [/\.s?css$/] }),
        esbuild(),
        indexPlugins
      ]
    },
    ...Object.entries(exportsEntries).map(([name, input]) => {
      const outputName = namePrefix + (
        name === 'index' ? '' : (
          name[0].toUpperCase() + name.slice(1)
        )
      )
      return {
        input: input,
        output: [
          {
            ...commonOutputOptions,
            name: outputName,
            format: 'iife',
            entryFileNames: `${name}.iife.js`
          },
          {
            ...commonOutputOptions,
            name: outputName,
            format: 'umd',
            entryFileNames: `${name}.umd.js`
          }
        ],
        plugins: [
          globalsOutput,
          styled && postcss({
            plugins: [autoprefixer],
            minimize: true,
            sourceMap: true,
            extract: `${name}.css`
          }),
          esbuild(),
          entryPlugins
        ],
        external
      }
    }),
    {
      input: exportsEntries,
      output: {
        dir: 'dist',
        entryFileNames: ({ name }) => `${name.replace(/^src\//, '')}.d.ts`,
        preserveModules: true
      },
      plugins: [
        styled && skip({ patterns: [/\.s?css$/] }),
        dts({ tsconfig: resolveWorkspacePath('tsconfig.dts.json') }),
        dtsPlugins
      ],
      external
    }
  ] as RollupOptions[]
}
