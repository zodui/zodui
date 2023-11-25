import fs from 'fs'
import hljs from 'highlight.js'
import { marked, Slugger } from 'marked'
import path from 'path'

export const MD_PLUGIN: (readonly [marked.RendererObject, string])[] = []

export function defineMDPlugin(renderer: marked.RendererObject, src: string | string[]) {
  const srcs = Array.isArray(src) ? src : [src]
  marked.use({ renderer })
  return [renderer, srcs.map(src => `<script type='module' src='${src}'></script>`).join('')] as const
}

type TreeNode = {
  path: string
  children?: TreeNode[]
}

function getAllFileTree(dirPath: string) {
  const files = fs.readdirSync(dirPath)
  return files.reduce((acc, cur) => {
    const filePath = path.join(dirPath, cur)
    const stats = fs.statSync(filePath)
    if (stats.isDirectory()) {
      acc.push({
        path: filePath,
        children: getAllFileTree(filePath)
      })
    } else if (stats.isFile()) {
      acc.push({
        path: filePath
      })
    }
    return acc
  }, [] as TreeNode[])
}

interface DocumentFileTree {
  title: string
  href: string
  children?: DocumentFileTree[]
}

interface DirectoryMeta {
  title: string
  children: string[]
}

const baseDFTMap = new Map<string, DocumentFileTree>()

function getDocumentFileTree(tree: TreeNode[], p: string, base = p): DocumentFileTree {
  const dirMeta = (JSON.parse(fs.readFileSync(
    path.resolve(p, './meta.json'), 'utf-8')
  ) as DirectoryMeta)
  const dft: DocumentFileTree = {
    title: dirMeta.title,
    href: p
      .replace(base, '')
      .replace(/.md$/, '')
  }
  dirMeta.children.forEach(filename => {
    if (!dft.children) {
      dft.children = []
    }

    const { path: realPath, children } = tree.find(({ path }) => path.endsWith(filename)) ?? {}
    if (!children) {
      const mdContent = fs.readFileSync(realPath!, 'utf-8')
      const mdHeader = /^# (.*)\n/[Symbol.match](mdContent)
      if (!mdHeader) {
        console.warn(`文件 ${realPath} 未包含标题`)
        return
      }
      dft.children?.push({
        title: mdHeader[1],
        href: realPath
          .replace(base, '')
          .replace(/.md$/, '')
      })
    } else {
      dft.children?.push(getDocumentFileTree(children, realPath!, base))
    }
  })
  return dft
}

export function docsTemplateRender(p: string, base: string, urlBase: string) {
  const pWithoutExt = p.replace(/.md$/, '')

  const tree = baseDFTMap.has(base)
    ? baseDFTMap.get(base)!
    : getDocumentFileTree(getAllFileTree(base), base, path.dirname(base))
  baseDFTMap.set(base, tree)
  const tabs = tree.children
  const activeTab = tabs.find(tab => `/${p}`.startsWith(tab.href))
  const activeClassification = activeTab?.children?.find(page => `/${p}`.startsWith(page.href))
  const activePage = activeClassification?.children?.find(page => `/${pWithoutExt}` === page.href)

  const prevPage = (() => {
    if (!activePage) {
      return null
    }
    const classificationIndex = activeTab.children.findIndex(classification => classification === activeClassification)
    const pageIndex = activeClassification.children.findIndex(page => page === activePage)
    if (pageIndex === 0) {
      return activeTab
        .children[classificationIndex - 1]
        ?.children
        ?.slice(-1)[0]
        ?? null
    }
    return activeClassification!.children![pageIndex - 1]
  })()
  const nextPage = (() => {
    if (!activePage) {
      return null
    }
    const classificationIndex = activeTab.children.findIndex(classification => classification === activeClassification)
    const pageIndex = activeClassification.children.findIndex(page => page === activePage)
    if (pageIndex === activeClassification.children.length - 1) {
      return activeTab
        .children[classificationIndex + 1]
        ?.children
        ?.slice(0)[0]
        ?? null
    }
    return activeClassification!.children![pageIndex + 1]
  })()

  const slugger = new Slugger()
  const content = fs.readFileSync(path.resolve(process.cwd(), p), 'utf-8')

  const menu = marked.lexer(content).reduce((acc, cur) => {
    if (cur.type === 'heading') {
      const { depth, text } = cur
      const title = slugger.slug(text)

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
  const menuHTML = `
  <ul class='menu'>
    <h3>菜单</h3>
    ${Object.entries(menu).map(([title, { href, children }]) => `
      <li class='menu-item'>
        <a href='#${href}'>${title}</a>
        ${
          children && Object.keys(children).length > 0 ? `<ul class='menu-sub'>${
            Object.entries(children)
              .map(([title, href]) => `<li class='menu-sub-item'><a href='#${href}'>${title}</a></li>`)
              .join('')
          }</ul>` : ''
        }
      </li>`).join('')
  }</ul>`.trim()
  return `
    <div class='left-panel'>
      <div class='tabs'>
        ${tabs.map(tab => `<div class='${
          'tab'
          + (tab === activeTab ? ' active' : '')
        }'>
        <a href='${urlBase}${(() => {
          const firstClassification = tab.children?.[0]
          const firstPage = firstClassification?.children?.[0]
          return firstPage?.href ?? firstClassification?.href ?? tab.href
        })()}'>${tab.title}</a>
      </div>`).join('')}
      </div>
      ${activeClassification ? `<ul class='classifications'>
        ${activeTab.children.map(classification => `<li class='classification'>
          ${classification.title}
          <ul class='classification-pages'>
            ${classification.children.map(page => `<li class='${
              'classification-page'
              + (page === activePage ? ' active' : '')
            }'>
              <a href='${urlBase}${page.href}'>${page.title}</a>
            </li>`).join('')}
          </ul>
        </li>`).join('')}
      </ul>` : ''}
    </div>
    <div class='container'>
      <div class='markdown-body'>
        ${marked(content)}
      </div>
      <div class='operates'>
        <div class='report'></div>
        <div class='edit-in-github'></div>
      </div>
      <div class='pagination'>
        ${prevPage ? `<a href='${urlBase}${prevPage?.href ?? ''}'>
          <div class='prev'>
            <div class='operate'>
              <span class='material-icons'>chevron_left</span>
              上一篇
            </div>
            <br>
            <div class='title'>${prevPage?.title ?? ''}</div>
          </div>
        </a>` : ''}
        ${nextPage ? `<a href='${urlBase}${nextPage?.href ?? ''}'>
          <div class='next'>
            <div class='operate'>
              下一篇
              <span class='material-icons'>chevron_right</span>
            </div>
            <br>
            <div class='title'>${nextPage?.title ?? ''}</div>
          </div>
        </a>` : ''}
      </div>
      <div class='comments'></div>
    </div>
    ${menuHTML}
  `.trim()
}

marked.setOptions({
  highlight(code: string, lang: string): string | void {
    return hljs.highlightAuto(code, [lang]).value
  }
})
