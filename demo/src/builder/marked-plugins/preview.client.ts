document.querySelectorAll<HTMLDivElement>('.zodui-preview')
  .forEach(ele => {
    const {
      schemaEvalKey = '',
      code = '',
    } = ele.dataset
    const originalCode = decodeURIComponent(code)
    const preview = originalCode.split('// preview\n')[1]
    window.emitCode(schemaEvalKey, `import * as z from 'zod'\n\nexport default ${preview}`)
  })
