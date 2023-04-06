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
    disabled: true
  },
  {
    title: 'Handbook',
    filename: 'handbook',
    template: 'public/handbook.html',
    depFiles: [/templates/, /components/],
    disabled: true
  },
  {
    title: 'Playground',
    filename: 'play',
    template: 'public/play.html',
    depFiles: [/templates/, /components/]
  },
  {
    title: 'Community',
    filename: 'docs',
    template: 'public/community.html',
    depFiles: [/templates/, /components/],
    disabled: true
  }
]

const TABS = pages.map(({ depFiles, ...rest }) => ({
  ...rest,
  href: `${base}${rest.filename}`
}))

const ejsOptions: EJSOptions = {
  includer(originalPath, parsedPath) {
    const paths = [
      path.resolve(process.cwd(), `public/${originalPath}.html`),
      path.resolve(process.cwd(), `src/${originalPath}.html`),
    ]
    for (const path of paths) {
      if (fs.existsSync(path)) return { filename: path }
    }
    return { filename: originalPath }
  }
}

function commonInjectOptionsData() {
  const MONACO_DTS_FILES: { content: string, filePath: string }[] = []

  function importDTSFiles(module: string, targetPath: string) {
    function addDtsFileContent(filePath: string) {
      let content = fs.readFileSync(filePath, 'utf-8')
      MONACO_DTS_FILES.push({
        content,
        filePath: filePath.replace(targetPath, `file:///node_modules/@types/${module}`)
      })
    }
    function findDtsFiles(dirPath: string) {
      const files = fs.readdirSync(dirPath)
      for (const file of files) {
        const filePath = path.join(dirPath, file)
        const stats = fs.statSync(filePath)
        if (stats.isDirectory()) {
          findDtsFiles(filePath)
        } else if (stats.isFile() && (
          path.basename(filePath).endsWith('.d.ts')
          || path.basename(filePath).endsWith('.ts')
        )) {
          addDtsFileContent(filePath)
        }
      }
    }
    findDtsFiles(targetPath)
  }

  importDTSFiles('zod', path.join(__dirname, '../node_modules', 'zod/lib'))

  return {
    TABS,
    MONACO_DTS_FILES: JSON.stringify(MONACO_DTS_FILES)
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
              ...commonInjectOptionsData()
            }),
            ejsOptions
          },
          // TODO when file change only update target page
          // TODO auto analysis dep files
          depFiles: [/templates/, /components/]
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
