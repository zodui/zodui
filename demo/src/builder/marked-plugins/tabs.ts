import * as cheerio from 'cheerio'
import { marked } from 'marked'

import { defineMDPlugin } from '../index'

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
        content: (
          tab.children[0] as { data: string }
        ).data
      }))
    console.log('tabs', tabs)
    return false
  }
}, [
])
