import { defineMDPlugin, marked } from '..'

export default defineMDPlugin({
  code(code, lang) {
    if (lang.includes('no-copy')) return false
    return `<div class='copy-wrap'>
      <div class='copy-btn material-icons'>
        content_copy
      </div>
      ${marked.parse(`\`\`\`${lang} no-copy\n${code}\n\`\`\``)}
    </div>`
  }
}, [
  '/src/builder/marked-plugins/copy.client.ts'
])
