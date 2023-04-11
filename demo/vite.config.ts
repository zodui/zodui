import * as fs from 'fs'
import * as path from 'path'

import { buildSync } from 'esbuild'

import { marked } from 'marked'

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
    if (originalPath.startsWith('docs/')) {
      const filePath = path.resolve(process.cwd(), `docs/${originalPath.replace('docs/', '')}`)
      const content = fs.readFileSync(filePath, 'utf-8')

      const menu = marked.lexer(content).reduce((acc, cur) => {
        if (cur.type === 'heading') {
          const { depth, text } = cur
          const title = text.toLowerCase().replace(/ /g, '-')

          if (depth === 2) {
            acc[text] = {
              href: title,
              title,
              children: {}
            }
          } else if (depth === 3) {
            const lastKey = Object.keys(acc).pop()
            if (lastKey) {
              acc[lastKey].children![text] = title
            }
          }
        }
        return acc
      }, {} as Record<string, {
        href: string
        title: string
        children?: Record<string, string>
      }>)
      const menuHTML = `<ul class='menu'>${
        Object.entries(menu).map(([title, { href, children }]) => `<li class='menu-item'>
          <a href='#${href}'>${title}</a>${
            children && Object.keys(children).length > 0 ? `<ul class='menu-sub'>${
              Object.entries(children)
                .map(([title, href]) => `<li class='menu-sub-item'><a href='#${href}'>${title}</a></li>`)
                .join('')
            }</ul>` : ''
          }
        </li>`).join('')
      }</ul>`
      return {
        template: `
          <div class='markdown'>
            ${marked(content)}
          </div>
          <div style='min-height: 50%' class='comments'></div>
          ${menuHTML}
        `.trim()
      }
    }
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

const hash = Date.now()

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

  let filePath = path.join(__dirname, '../packages/react/src/zod.external.ts')
  let content = fs.readFileSync(filePath, 'utf-8')
  MONACO_DTS_FILES.push({
    content,
    filePath: `file:///node_modules/@types/zodui/external.ts`
  })

  const zoduiExternalPath = process.env.NODE_ENV === 'development'
    ? path.join(__dirname, '../packages/react/src/zod.external.ts')
    : `${base}assets/zodui.external-${hash}.js`

  return {
    TABS,
    MONACO_DTS_FILES: JSON.stringify(MONACO_DTS_FILES),
    IMPORT_MAP: JSON.stringify({
      imports: {
        'zod': zoduiExternalPath,
        'zodui/external': zoduiExternalPath
      }
    })
  }
}

process.env.NODE_ENV === 'production' && buildSync({
  target: 'es2020',
  format: 'esm',
  entryPoints: [
    path.resolve(__dirname, '../packages/react/src/zod.external.ts')
  ],
  outfile: `./dist/assets/zodui.external-${hash}.js`,
  bundle: true,
  minify: true,
  sourcemap: 'inline',
})

export default defineConfig({
  base,
  build: {
    emptyOutDir: false
  },
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
          })),
        {
          filename: 'docs/main',
          template: 'src/docs.html',
          injectOptions: {
            data: () => ({
              ...commonInjectOptionsData(),
              path: 'main.md',
              TITLE: 'Docs[main]'
            }),
            ejsOptions
          },
          depFiles: [/templates/, /components/, /docs/]
        },
        {
          filename: 'docs/guide/monad',
          template: 'src/docs.html',
          injectOptions: {
            data: () => ({
              ...commonInjectOptionsData(),
              path: 'guide/monad.md',
              TITLE: 'Docs[Guide Monad]'
            }),
            ejsOptions
          },
          depFiles: [/templates/, /components/, /docs/]
        },
      ]
    })
  ],
})
