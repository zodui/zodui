import type { OutputOptions } from 'rollup'

export const commonOutputOptions: OutputOptions = {
  dir: 'dist',
  exports: 'named',
  sourcemap: true
}
