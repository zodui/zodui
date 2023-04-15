import './preview.client.scss'

document.querySelectorAll<HTMLDivElement>('.zodui-preview')
  .forEach(ele => {
    const {
      schemaEvalKey = '',
      code = '',
    } = ele.dataset
    const originalCode = decodeURIComponent(code)
    emitCode(schemaEvalKey, `import * as z from 'zod'\n\nexport default ${originalCode}`)
    const [exchange, mdBody, evaler] = ele.children
    let isEvalerVisible = false
    exchange.addEventListener('click', function () {
      if (isEvalerVisible) {
        evaler.classList.add('hidden')
      } else {
        evaler.classList.remove('hidden')
      }
      isEvalerVisible = !isEvalerVisible
    })
  })
