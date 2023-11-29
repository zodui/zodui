import * as cheerio from 'cheerio'

import { defineMDPlugin, marked } from '..'

/**
 * ```md
 * <docs-tabs>
 *   <docs-tab title='tab1'>
 *   This is tab1, and the content is supported **markdown**.
 *   </docs-tab>
 *   <docs-tab title='tab2'>
 *   This is tab2.
 *   </docs-tab>
 * </docs-tabs>
 * ```
 */
export default defineMDPlugin({
  html(outerHTML) {
    if (!outerHTML.startsWith('<docs-tabs')) {
      return false
    }

    const $ = cheerio.load(outerHTML)
    const tabs = $('docs-tabs')
      .children('docs-tab')
      .toArray()
      .map(tab => ({
        title: tab.attribs['title'],
        icon: tab.attribs['icon'],
        content: (
          tab.children[0] as { data: string }
        ).data
      }))
    if (!tabs.length) {
      return false
    }
    return `
      <div class='docs-tabs'>
        <div class='docs-tabs__header'>
          ${tabs
            .map((tab, index) => `<div
              class="${'docs-tabs__header-item' + (index === 0 ? ' active' : '')}"
            >
              ${tab.icon ? `<div class='docs-tabs__header-item-icon'>${tab.icon}</div>` : ''}
              ${tab.title}
            </div>`)
            .join('')}
        </div>
        <div class='docs-tabs__content'>
          ${tabs
            .map(tab => `<div
              class='docs-tabs__content-item'
            >${marked.parse(tab.content)}</div>`)
            .join('')}
        </div>
      </div>
    `
  }
}, [
  '/src/builder/marked-plugins/tabs.client.ts'
])
