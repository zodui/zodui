import * as fs from 'fs'
import * as path from 'path'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { createHtmlPlugin } from 'vite-plugin-html'

import { Options as EJSOptions } from 'ejs'

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
    depFiles: [/templates/],
    disabled: true,
  },
  {
    title: 'Playground',
    filename: 'play',
    template: 'public/play.html',
    depFiles: [/templates/],
  },
  {
    title: 'Community',
    filename: 'docs',
    template: 'public/community.html',
    depFiles: [/templates/],
    disabled: true,
  }
]

const TABS = pages.map(({ depFiles, ...rest }) => ({
  ...rest,
  href: `${base}${rest.filename}`
}))

const ejsOptions: EJSOptions = {
  includer(originalPath, parsedPath) {
    return { filename: path.resolve(process.cwd(), `public/${originalPath}.html`) }
  }
}

function commonInjectOptionsData() {
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

  return { TABS, ZOD_DTS_FILES: JSON.stringify(ZOD_DTS_FILES) }
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
              ...commonInjectOptionsData()
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
                ...commonInjectOptionsData(),
                TITLE: p.title
              }),
              ejsOptions
            }
          }))
      ]
    })
  ],
})
