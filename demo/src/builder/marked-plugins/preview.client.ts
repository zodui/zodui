import './preview.client.scss'

import hljs from 'highlight.js'
import { marked } from 'marked'
import { markedHighlight } from 'marked-highlight'

marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    return hljs.highlight(code, { language }).value
  }
}))

document.querySelectorAll<HTMLDivElement>('.zodui-preview')
  .forEach(ele => {
    const {
      schemaEvalKey = '',
      code = ''
    } = ele.dataset
    const originalCode = decodeURIComponent(code)
    emitCode(schemaEvalKey, originalCode)
    const [mdEle] = ele.querySelector('.wrap')!.children
    const drawBar = ele.querySelector('.draw-bar')!
    drawBar.querySelector('.icon[data-key="open/close"]')!.addEventListener('click', () => {
      if (drawBar.classList.contains('display')) {
        drawBar.classList.remove('display')
      } else {
        drawBar.classList.add('display')
      }
    })
    drawBar.querySelector('.icon[data-key="Code"]')!.addEventListener('click', () => {
      if (mdEle.classList.contains('display')) {
        mdEle.classList.remove('display')
      } else {
        mdEle.classList.add('display')
      }
    })
    drawBar.querySelector('.icon[data-key="Playground"]')!.addEventListener('click', () => {
      open(`${
        location.origin
      }${
        import.meta.env.BASE_URL
      }play#${
        base64(decodeURIComponent(code), false)
      }`, '_blank')
    })
    drawBar.querySelector('.icon[data-key="StackBlitz"]')!.addEventListener('click', () => {
      // TODO open in StackBlitz
    })
    drawBar.querySelector('.icon[data-key="CodeSandBox"]')!.addEventListener('click', () => {
      // TODO open in CodeSandBox
    })

    const eleOutput = ele.querySelector<HTMLDivElement>(':scope > .output')!
    const eleOutputContent = eleOutput.querySelector<HTMLDivElement>(':scope > .content')!
    const eleOutputDown = eleOutput.querySelector<HTMLSpanElement>(':scope > .down')!
    eleOutputContent.innerHTML = '<pre><code class=\'hljs language-json\'>null</code></pre>'
    evalerValueEmitter.on(schemaEvalKey, (value: unknown) => {
      eleOutputContent.innerHTML = marked(`\`\`\`json\n${JSON.stringify(value, null, 2)}\n\`\`\``)
    })
    eleOutputDown.addEventListener('click', () => {
      if (eleOutput.classList.contains('display')) {
        eleOutput.classList.remove('display')
      } else {
        eleOutput.classList.add('display')
      }
    })
  })
