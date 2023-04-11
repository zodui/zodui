import * as fs from 'fs'
import * as path from 'path'

import { buildSync } from 'esbuild'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import virtual from '@rollup/plugin-virtual'
import tsconfigPaths from 'vite-tsconfig-paths'
import { createHtmlPlugin } from 'vite-plugin-html'

import { Options as EJSOptions } from 'ejs'

import { docsTemplateRender, MD_PLUGIN } from './src/builder'
import Preview from './src/builder/marked-plugins/preview'

MD_PLUGIN.push(Preview)

function findFilesBy(
  dirPath: string,
  extensions: string[],
  callback?: (filePath: string) => void
) {
  const files = fs.readdirSync(dirPath)
  for (const file of files) {
    const filePath = path.join(dirPath, file)
    const stats = fs.statSync(filePath)
    if (stats.isDirectory()) {
      findFilesBy(filePath, extensions, callback)
    } else if (stats.isFile() && extensions?.some(ext => filePath.endsWith(ext))) {
      callback?.(filePath)
    }
  }
}

const base = '/zodui/'

const tabs = [
  {
    title: 'Docs',
    filename: 'docs',
    template: 'src/docs.html',
    // TODO auto analysis dep files
    depFiles: [/templates/, /components/],
    disabled: true
  },
  {
    title: 'Handbook',
    filename: 'handbook',
    template: 'src/handbook.html',
    depFiles: [/templates/, /components/],
    disabled: true
  },
  {
    title: 'Playground',
    filename: 'play',
    template: 'src/play.html',
    depFiles: [/templates/, /components/]
  },
  {
    title: 'Community',
    filename: 'docs',
    template: 'src/community.html',
    depFiles: [/templates/, /components/],
    disabled: true
  }
]

const TABS = tabs.map(({ depFiles, ...rest }) => ({
  ...rest,
  href: `${base}${rest.filename}`
}))

const ejsOptions: EJSOptions = {
  includer(originalPath, parsedPath) {
    if (originalPath.startsWith('docs/')) {
      return { template: docsTemplateRender(originalPath) }
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

const docsPages: Exclude<Parameters<typeof createHtmlPlugin>[0], undefined>['pages'] = []
initDocs: {
  const docsPath = path.resolve(__dirname, './docs')
  findFilesBy(docsPath, ['.md'], filePath => {
    const docFilePath = path.relative(docsPath, filePath)
    docsPages.push({
      filename: `docs/${
        docFilePath.replace(/\.md$/, '')
      }`,
      template: 'src/docs.html',
      injectOptions: {
        data: () => ({
          ...commonInjectOptionsData(),
          path: docFilePath,
          TITLE: `Docs[${docFilePath}]`,
          GLOBAL_SCRIPTS: MD_PLUGIN.map(([, src]) => src).join('')
        }),
        ejsOptions
      },
      depFiles: [/templates/, /components/, /docs/]
    })
  })
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
    findFilesBy(targetPath, ['.ts', '.d.ts'], addDtsFileContent)
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
    emptyOutDir: false,
    rollupOptions: {
      ...(process.env.NODE_ENV !== 'development' ? {
        input: {
          'docs/guide/index': 'docs/guide/index.html',
          'docs/guide/monad': 'docs/guide/monad.html',
          'docs/main': 'docs/main.html'
        }
      } : {}),
    },
  },
  plugins: [
    react(),
    tsconfigPaths(),
    process.env.NODE_ENV !== 'development' ? (() => {
      const docsContent = fs.readFileSync(path.resolve(__dirname, './src/docs.html'), 'utf-8')
      return virtual({
        'docs/guide/index.html': docsContent,
        'docs/guide/monad.html': docsContent,
        'docs/main.html': docsContent
      })
    })() : [],
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
        ...tabs
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
        ...docsPages
      ]
    })
  ],
})
