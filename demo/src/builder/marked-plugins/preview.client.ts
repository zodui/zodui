import './preview.client.scss'

import hljs from 'highlight.js'
import { marked } from 'marked'

marked.setOptions({
  highlight(code: string, lang: string): string | void {
    return hljs.highlightAuto(code, [lang]).value
  }
})

document.querySelectorAll<HTMLDivElement>('.zodui-preview')
  .forEach(ele => {
    const {
      schemaEvalKey = '',
      code = ''
    } = ele.dataset
    const originalCode = decodeURIComponent(code)
    emitCode(schemaEvalKey, originalCode)
    const [, evaler] = ele.querySelector('.wrap')!.children
    const drawBar = ele.querySelector('.draw-bar')!
    let isDrawBarVisible = false
    drawBar.querySelector('.icon[data-key="open/close"]')!.addEventListener('click', () => {
      if (isDrawBarVisible) {
        drawBar.classList.remove('display')
      } else {
        drawBar.classList.add('display')
      }
      isDrawBarVisible = !isDrawBarVisible
    })
    drawBar.querySelector('.icon[data-key="Code"]')!.addEventListener('click', () => {
      if (evaler.classList.contains('hidden')) {
        evaler.classList.remove('hidden')
      } else {
        evaler.classList.add('hidden')
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

    const eleOutputContent = ele.querySelector<HTMLDivElement>(':scope > .output > .content')!
    eleOutputContent.innerText = 'null'
    evalerValueEmitter.on(schemaEvalKey, (value: unknown) => {
      eleOutputContent.innerHTML = marked(`\`\`\`json\n${JSON.stringify(value, null, 2)}\n\`\`\``)
    })
  })
