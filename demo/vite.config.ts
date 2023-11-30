import virtual from '@rollup/plugin-virtual'
import react from '@vitejs/plugin-react'
import type { Options as EJSOptions } from 'ejs'
import { buildSync } from 'esbuild'
import * as fs from 'fs'
import * as path from 'path'
import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import tsconfigPaths from 'vite-tsconfig-paths'

/* eslint-disable @typescript-eslint/no-restricted-imports */
import { docsTemplateRender, mdPlugins } from './src/builder'
/* eslint-enable @typescript-eslint/no-restricted-imports */

const ZOD_EXTERNAL_FILE_PATH = path.join(__dirname, '../packages/core/src/external.ts')

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

const TABS = tabs.map(({ depFiles: _, ...rest }) => ({
  ...rest,
  href: `${base}${rest.filename}`
}))

const ejsOptions: EJSOptions = {
  // @ts-ignore
  includer(originalPath) {
    if (originalPath.startsWith('docs/')) {
      return {
        template: docsTemplateRender(
          originalPath,
          path.resolve(__dirname, './docs'),
          base.slice(0, -1)
        )
      }
    }

    const paths = [
      path.resolve(process.cwd(), `src/${originalPath}.html`)
    ]
    for (const path of paths) {
      if (fs.existsSync(path)) return { filename: path }
    }
    return { filename: originalPath }
  }
}

const documentTemplateContent = fs.readFileSync(path.resolve(__dirname, './src/docs-template.html'), 'utf-8')
const documentsPages: Exclude<Parameters<typeof createHtmlPlugin>[0], undefined>['pages'] = []
{
  const documentsBasePath = path.resolve(__dirname, './docs')
  findFilesBy(documentsBasePath, ['.md'], filePath => {
    const docFilePath = path.relative(documentsBasePath, filePath)
    const filename = `docs/${
      docFilePath.replace(/\.md$/, '')
    }`
    documentsPages.push({
      filename,
      template: 'src/docs-template.html',
      injectOptions: {
        data: () => ({
          ...commonInjectOptionsData(),
          path: docFilePath,
          TITLE: `Docs[${docFilePath}]`,
          GLOBAL_SCRIPTS: mdPlugins.map(([, src]) => src).join('')
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
      const content = fs.readFileSync(filePath, 'utf-8')
      MONACO_DTS_FILES.push({
        content,
        filePath: filePath.replace(targetPath, `file:///node_modules/@types/${module}`)
      })
    }
    findFilesBy(targetPath, ['.ts', '.d.ts'], addDtsFileContent)
  }

  importDTSFiles('zod', path.join(__dirname, './node_modules', 'zod/lib'))
  importDTSFiles('@zodui/core', path.join(__dirname, '../packages/core/src'))

  const zoduiExternalPath = process.env.NODE_ENV === 'development'
    ? ZOD_EXTERNAL_FILE_PATH
    : `${base}assets/zodui.external-${hash}.js`

  return {
    TABS,
    MONACO_DTS_FILES: JSON.stringify(MONACO_DTS_FILES),
    IMPORT_MAP: JSON.stringify({
      imports: {
        'zod': zoduiExternalPath,
        'zodui': zoduiExternalPath,
        '@zodui/core/external': zoduiExternalPath
      }
    })
  }
}

process.env.NODE_ENV === 'production' && buildSync({
  target: 'es2020',
  format: 'esm',
  entryPoints: [
    ZOD_EXTERNAL_FILE_PATH
  ],
  outfile: `./dist/assets/zodui.external-${hash}.js`,
  bundle: true,
  minify: true,
  sourcemap: 'inline'
})

export default defineConfig({
  base,
  build: {
    emptyOutDir: false,
    rollupOptions: Object.assign({
      output: {
        manualChunks(id: string) {
          if (id.includes('components-lib/tdesign')) {
            return 'comps-lib-tdesign'
          }
          const external = ['react', 'react-dom', 'tdesign-react', 'tdesign-icons-react']
          const matchId = external.find(ext => id.includes(`node_modules/${ext}`))
          if (matchId) {
            return `${matchId}`
          }
        }
      }
    }, process.env.NODE_ENV !== 'development' ? {
      external: ['zod', 'zodui/external'],
      input: documentsPages.reduce((input, { filename }) => {
        input[filename] = `${filename}.html`
        return input
      }, {} as Record<string, string>)
    } : {})
  },
  plugins: [
    react(),
    tsconfigPaths(),
    process.env.NODE_ENV !== 'development' && virtual(
      documentsPages.reduce((input, { filename }) => {
        input[`${filename}.html`] = documentTemplateContent
        return input
      }, {} as Record<string, string>)
    ),
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
        ...documentsPages
      ]
    })
  ]
})
