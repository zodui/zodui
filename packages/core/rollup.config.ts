import fs from 'node:fs'
import { resolve } from 'node:path'

import rollupTemplate from 'rollup-helper/rollup.template'

const pkgJson = JSON.parse(fs.readFileSync(resolve(process.cwd(), 'package.json'), 'utf-8')) as {
  exports: Record<string, {
    'inner-src': string
  }>
}
const exportsEntries = Object.fromEntries(
  Object.entries(pkgJson.exports)
    .filter(([key]) => !key.endsWith('.json'))
    .map(([key, value]) => [
      key
        .replace(/^\.$/, 'index')
        .replace(/^\.\//, ''),
      value['inner-src']
    ])
)

export default rollupTemplate(exportsEntries)
