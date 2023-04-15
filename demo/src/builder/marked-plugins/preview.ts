import { defineMDPlugin } from '../index'
import { marked } from 'marked'

function uuid() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export default defineMDPlugin({
  code(code, lang, escaped) {
    if (lang?.includes('zodui:preview')) {
      const id = uuid()
      const previewCode = code.split('// preview\n')[1]
      return `
      </div>
      <div class='zodui-preview' data-schema-eval-key='${id}' data-code='${
        encodeURIComponent(previewCode)
          .replace(/'/g, '%27')
          .replace(/"/g, '%22')
      }'>
        <div class='exchange material-icons'>swap_vert</div>
        <div class='markdown-body'>
          ${marked(`\`\`\`typescript\n${previewCode}\n\`\`\``)}
        </div>
        <%- include('components/schema-eval', {
          key: '${id}'
        }) %>
      </div>
      <div class='markdown-body'>`
    }
    return false
  }
}, [
  '/src/builder/marked-plugins/preview.client.ts',
  '/src/components/schema-eval.tsx'
])
