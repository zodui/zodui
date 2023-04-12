import { marked, Slugger } from 'marked'
import fs from 'fs'
import path from 'path'

export const MD_PLUGIN: (readonly [marked.RendererObject, string])[] = []

export function defineMDPlugin(renderer: marked.RendererObject, src: string | string[]) {
  const srcs = Array.isArray(src) ? src : [src]
  marked.use({ renderer })
  return [renderer, srcs.map(src => `<script type='module' src='${src}'></script>`).join('')] as const
}

export function docsTemplateRender(p: string) {
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
  const menuHTML = `<ul class='menu'>
  ${Object.entries(menu).map(([title, { href, children }]) => `
    <li class='menu-item'>
      <a href='#${href}'>${title}</a>${
      children && Object.keys(children).length > 0 ? `<ul class='menu-sub'>${
        Object.entries(children)
          .map(([title, href]) => `<li class='menu-sub-item'><a href='#${href}'>${title}</a></li>`)
          .join('')
      }</ul>` : ''}
    </li>`).join('')
  }</ul>`
  return `
    ${menuHTML}
    <div class='markdown'>
      ${marked(content)}
    </div>
    <div style='min-height: 50%' class='comments'></div>
  `.trim()
}
