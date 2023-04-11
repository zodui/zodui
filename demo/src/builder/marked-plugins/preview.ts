import { defineMDPlugin } from '../index'

export default defineMDPlugin({
  code(code, lang, escaped) {
    if (lang?.includes('zodui:preview')) {
      return `<div class='zodui-preview' data-code='${
        encodeURIComponent(code)
          .replace(/'/g, '%27')
          .replace(/"/g, '%22')
      }'></div>`
    }
    return false
  }
}, '/src/builder/marked-plugins/preview.client.ts')
