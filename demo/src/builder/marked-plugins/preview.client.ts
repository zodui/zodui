document.querySelectorAll<HTMLDivElement>('.zodui-preview')
  .forEach(ele => {
    const {
      schemaEvalKey = '',
      code = '',
    } = ele.dataset
    const originalCode = decodeURIComponent(code)
    window.emitCode(schemaEvalKey, `import * as z from 'zod'\n\nexport default ${originalCode}`)
  })
