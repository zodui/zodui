import { Slugger } from 'marked'

import { defineMDPlugin } from '../index'

export default defineMDPlugin({
  heading(text, level, raw) {
    const slugger = new Slugger()
    const tagName = `h${level}`
    const sluggerText = slugger.slug(raw)

    // TODO turn href to click function, inorder to smooth scroll
    return `<${tagName} class='anchor-point' id='${sluggerText}'>
      <a href='#${level > 1 ? sluggerText : ''}'>#</a>
      ${raw}
    </${tagName}>`
  }
}, [
  '/src/builder/marked-plugins/header.client.ts'
])
