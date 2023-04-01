const DEFAULT_CODE = `import * as z from 'zod'

export default z
  .object({
    foo: z.string()
  })
  .label('Object')
  .describe('This is a Object Configuration')
`

const ZOD_EXTERNAL = `import z, { Schema, ZodDefaultDef, ZodFirstPartyTypeKind, ZodObject, ZodType, ZodTypeAny } from 'zod'

export interface ModesMap {
  [ZodFirstPartyTypeKind.ZodNumber]:
    | 'slider'
    | 'rate'
  [ZodFirstPartyTypeKind.ZodString]:
    | 'textarea'
    | 'link'
    | 'secrets'
    | 'date'
    | 'datetime'
    | 'time'
    | 'panel'
  [ZodFirstPartyTypeKind.ZodBoolean]:
    | 'checkbox'
  [ZodFirstPartyTypeKind.ZodDate]:
    | 'datetime'
    | 'time'
    | 'panel'
  [ZodFirstPartyTypeKind.ZodTuple]:
    | 'range'
    | 'slider'
    | 'no-range'
    | 'no-slider'
    | 'datetime'
    | 'time'
    | 'panel'
}

declare module 'zod' {
  export interface ZodTypeDef {
    mode: string
    label: string
  }
  export interface ZodType<Output = any, Def extends ZodTypeDef = ZodTypeDef, Input = Output> {
    readonly _mode: string
    mode<T extends string>(
      mode:
        | Def extends ZodDefaultDef<infer InnerT>
          ? ModesMap[InnerT['_def']['typeName']]
          : ModesMap[Def['typeName']]
        | (string & {})
    ): ZodType<Output, Def, Input>

    readonly _label: string
    label(mode: string): ZodType<Output, Def, Input>

    readonly type: string
  }
  export function clazz<T>(clazz: { new(): T }): Schema<T>
  export function asObejct<T extends any>(t: T): ZodObject<Record<string, ZodTypeAny> & T>
}`

const mediaQueryListDark = window.matchMedia('(prefers-color-scheme: dark)')

if (mediaQueryListDark.matches) {
  window.theme = 'dark'
  document.documentElement.setAttribute('theme-mode', 'dark')
} else {
  window.theme = 'light'
  document.documentElement.removeAttribute('theme-mode')
}

mediaQueryListDark.addListener(function handleChange (mediaQueryListEvent) {
  if (mediaQueryListEvent.matches) {
    monaco.editor.setTheme('vs-dark')
  } else {
    monaco.editor.setTheme('vs')
  }
})

let editor: monaco.editor.IStandaloneCodeEditor
const changeListeners: Function[] = []

window.onCodeChange = function (fn) {
  // TODO refactor as import maps
  const nfn = (s: string) => fn(`${s}
;(window?.____DEFAULT_EXPORT_VALUE____)`
    .replace('export default ', 'window.____DEFAULT_EXPORT_VALUE____ = ')
    .replace(/import ([\s\S]*) from 'zod'/g, 'var $1 = window.z')
    .replace(/\* as/g, '')
    .replace(/import ([\s\S]*) from .*/g, ''))
  changeListeners.push(nfn)
  nfn(editor?.getValue())
  const index = changeListeners.length - 1
  return () => {
    if (index > -1) changeListeners.splice(index, 1)
  }
}
function updateCode(s: string) {
  changeListeners.forEach((fn) => fn(s))
}
window.addEventListener('load', function () {
  function setCodeByUrl() {
    const hash = location.hash.slice(1)
    const code = hash ? base64(hash) : DEFAULT_CODE
    editor.setValue(code)
    updateCode(code)
  }

  // watch hash change
  window.addEventListener('hashchange', setCodeByUrl)
  // add custom dts
  monaco.languages.typescript.typescriptDefaults.setExtraLibs(
    ZOD_DTS_FILES
      .concat([{ content: ZOD_EXTERNAL, filePath: 'file:///env.d.ts' }])
  )
  editor = monaco.editor.create(document.getElementById('container')!, {
    theme: window.theme === 'dark' ? 'vs-dark' : 'vs',
    value: '',
    language: 'typescript',
    tabSize: 2,
    model: monaco.editor.createModel('', 'typescript', monaco.Uri.parse('file:///main.ts')),
  })

  setCodeByUrl()
  const historyCodes: { code: string }[] = []
  let historyIndex = -1
  // watch editor value change
  editor.onDidChangeModelContent(debounce(function () {
    updateCode(editor.getValue())
  }, 1500))
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
    const code = editor.getValue()
    updateCode(code)
    // save code to hash
    location.hash = `#${base64(code, false)}`
    // copy url to clipboard
    copyToClipboard(location.href)
    showMessage('<h3 style="margin: 0">url copied to clipboard, share it with your friends!</h3>')
  })
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.UpArrow, function () {
    if (historyIndex === -1) {
      historyIndex = historyCodes.length - 1
    } else {
      historyIndex--
    }
    if (historyIndex < 0) {
      historyIndex = 0
    }
    editor.setValue(historyCodes[historyIndex].code)
  })
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.DownArrow, function () {
    if (historyIndex === -1) {
      historyIndex = historyCodes.length - 1
    } else {
      historyIndex++
    }
    if (historyIndex >= historyCodes.length) {
      historyIndex = historyCodes.length - 1
    }
    editor.setValue(historyCodes[historyIndex].code)
  })
  editor.focus()
})
