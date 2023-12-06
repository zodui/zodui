import type { PluginImpl } from 'rollup'

interface Options {
  patterns?: (string | RegExp)[]
}

export default ((options = {}) => {
  return {
    name: 'skip',
    // skip the specified files by `options.patterns`
    load(id) {
      if (
        options.patterns?.some((pattern) =>
          typeof pattern === 'string'
            ? id.includes(pattern)
            : pattern.test(id)
        )
      ) {
        return ''
      }
    }
  }
}) as PluginImpl<Options>
