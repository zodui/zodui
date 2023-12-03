import path from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const resolvePackagesPath = (p: string) => path.resolve(__dirname, '../../packages', p)

export default defineConfig(env => ({
  resolve: env.mode === 'development' ? {
    alias: [
      {
        find: /^@zodui\/(.*).css/,
        // redirect the css file to empty file
        replacement: path.resolve(__dirname, '.css.empty-import.ts')
      },
      { find: /^@zodui\/components-lib-(.*)\/(.*)/,
        replacement: resolvePackagesPath('components-lib/$1/src/$2') },
      { find: /^@zodui\/components-lib-(.*)/,
        replacement: resolvePackagesPath('components-lib/$1/src') },
      { find: /^@zodui\/plugin-(.*)\/(.*)/,
        replacement: resolvePackagesPath('plugins/$1/src/$2') },
      { find: /^@zodui\/plugin-(.*)/,
        replacement: resolvePackagesPath('plugins/$1/src') },
      { find: /^@zodui\/(.*)\/(.*)/,
        replacement: resolvePackagesPath('$1/src/$2') },
      { find: /^@zodui\/(.*)/,
        replacement: resolvePackagesPath('$1/src/index.ts') }
    ]
  } : undefined,
  plugins: [react()],
  server: {
    port: 11747
  }
}))
