import type { Plugin, PluginImpl } from 'rollup'

import globalResolver from '../utils/globalResolver'

interface GlobalsOptions {
  external?: (string | RegExp)[]
}

export function createGlobalsLinkage() {
  let globals = {}
  const dependencies = new Set([])
  return [
    (({ external } = {}) => {
      return {
        name: 'globals',
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
      }
    }) as PluginImpl<GlobalsOptions>,
    { outputOptions: options => ({ ...options, globals }) } as Plugin
  ] as const
}
