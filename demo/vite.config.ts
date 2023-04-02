import * as fs from 'fs'
import * as path from 'path'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { createHtmlPlugin } from 'vite-plugin-html'

import { Options as EJSOptions } from 'ejs'

const ZOD_DTS_FILES: { content: string, filePath: string }[] = []

initZOD_DTS_FILES: {
  const nodeModulesPath = path.join(__dirname, '../node_modules')
  const zodPackagePath = path.join(nodeModulesPath, 'zod/lib')

  function addZodDtsFileContent(filePath: string) {
    let content = fs.readFileSync(filePath, 'utf-8')
    ZOD_DTS_FILES.push({
      content,
      filePath: filePath.replace(zodPackagePath, 'file:///node_modules/@types/zod')
    })
  }
  function findZodDtsFiles(dirPath: string) {
    const files = fs.readdirSync(dirPath)
    for (const file of files) {
      const filePath = path.join(dirPath, file)
      const stats = fs.statSync(filePath)
      if (stats.isDirectory()) {
        findZodDtsFiles(filePath)
      } else if (stats.isFile() && path.basename(filePath).endsWith('.d.ts')) {
        addZodDtsFileContent(filePath)
      }
    }
  }
  findZodDtsFiles(zodPackagePath)
}

const base = '/zodui/'

const pages = [
  {
    title: 'Docs',
    filename: 'docs',
    template: 'public/docs.html',
    // TODO auto analysis dep files
    depFiles: [/templates/],
    disabled: true,
  },
  {
    title: 'Handbook',
    filename: 'handbook',
    template: 'public/handbook.html',
    // TODO auto analysis dep files
    depFiles: [/templates/],
    disabled: true,
  },
  {
    title: 'Playground',
    filename: 'play',
    template: 'public/play.html',
    // TODO auto analysis dep files
    depFiles: [/templates/],
  },
  {
    title: 'Community',
    filename: 'docs',
    template: 'public/community.html',
    // TODO auto analysis dep files
    depFiles: [/templates/],
    disabled: true,
  }
]

const TABS = pages.map(({ depFiles, ...rest }) => ({
  ...rest,
  href: `${base}${rest.filename}.html`
}))

const ejsOptions: EJSOptions = {
  includer(originalPath, parsedPath) {
    return { filename: path.resolve(process.cwd(), `public/${originalPath}.html`) }
  }
}

export default defineConfig({
  base,
  plugins: [
    react(),
    tsconfigPaths(),
    createHtmlPlugin({
      pages: [
        {
          filename: 'index.html',
          template: 'index.html',
          injectOptions: {
            data: () => ({
              TABS,
              ZOD_DTS_FILES: JSON.stringify(ZOD_DTS_FILES),
            }),
            ejsOptions
          },
          // TODO when file change only update target page
          // TODO auto analysis dep files
          depFiles: [/templates/]
        },
        ...pages
          .filter(p => !p.disabled)
          .map(p => ({
            filename: p.filename,
            template: p.template,
            depFiles: p.depFiles,
            injectOptions: {
              data: () => ({
                TABS,
                TITLE: p.title,
                ZOD_DTS_FILES: JSON.stringify(ZOD_DTS_FILES),
              }),
              ejsOptions
            }
          }))
      ]
    })
  ],
})
