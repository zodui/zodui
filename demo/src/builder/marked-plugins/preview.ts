import { defineMDPlugin } from '../index'

function uuid() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export default defineMDPlugin({
  code(code, lang, escaped) {
    if (lang?.includes('zodui:preview')) {
      const id = uuid()
      return `
      <div class='zodui-preview' data-schema-eval-key='${id}' data-code='${
        encodeURIComponent(code)
          .replace(/'/g, '%27')
          .replace(/"/g, '%22')
      }'>
        <%- include('components/schema-eval', {
          key: '${id}'
        }) %>
      </div>`
    }
    return false
  }
}, [
  '/src/builder/marked-plugins/preview.client.ts',
  '/src/components/schema-eval.tsx'
])
