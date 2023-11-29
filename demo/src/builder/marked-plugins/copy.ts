import { defineMDPlugin, marked } from '..'

export default defineMDPlugin({
  code(code, lang) {
    if (lang.includes('no-copy')) return false
    return `<div class='copy-wrap'>
      <div class='copy-btn material-icons' data-clipboard-text="${escapeHTML(code)}" title='Copy'>
        content_copy
      </div>
      ${marked.parse(`\`\`\`${lang} no-copy\n${code}\n\`\`\``)}
    </div>`
  }
}, [
  '/src/builder/marked-plugins/copy.client.ts'
])

function escapeHTML(html: string) {
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;') // "
    .replace(/'/g, '&#039;') // '
    .replace(/`/g, '&#x60;') // `
}
