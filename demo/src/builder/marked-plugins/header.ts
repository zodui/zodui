import { defineMDPlugin } from '../index'
import { slug } from '../slug'

export default defineMDPlugin({
  heading(text, level, raw) {
    const tagName = `h${level}`
    const sluggerText = slug(raw)

    // TODO turn href to click function, inorder to smooth scroll
    return `<${tagName} class='anchor-point' id='${sluggerText}'>
      <a href='#${level > 1 ? sluggerText : ''}'>#</a>
      ${raw}
    </${tagName}>`
  }
}, [
  '/src/builder/marked-plugins/header.client.ts'
])
