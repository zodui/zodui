import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'

import { ZodSchema } from 'zod'
import { Schema, SchemaRef, ItemConfigure, useItemConfigurer } from '@zodui/react'

import '@zodui/react/components-lib/tdesign'

import { createEmitter } from '../emitter'

interface DemoProps {
  k?: string
  c?: string

  configure?: ItemConfigure
}

window.evalerValueEmitter = createEmitter<[value: any]>()
window.evalerConfigureEmitter = createEmitter<[configure: any]>()

function Demo({
  k = '',
  c,
  configure: cc
}: DemoProps) {
  const { configure, ItemConfigurer } = useItemConfigurer(cc)

  const [code, setCode] = useState<string>(c ?? '')
  useEffect(() => onCodeChange(k, setCode), [])

  const [[schema] = [], setSchema] = useState<[ZodSchema]>()
  useEffect(() => {
    if (!code) return

    ;(async () => {
      try {
        const mjsEvalerURL = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }))
        const module = await import(/* @vite-ignore */ mjsEvalerURL)

        if (module.default && module.default._def)
          setSchema([module.default])
      } catch (e) {
        console.error(e)
      }
    })()
  }, [code])

  const ref = useRef<SchemaRef>(null)

  const [value, setValue] = useState<any>()

  useEffect(() => {
    return evalerValueEmitter.on(`${k}::init`, setValue)
  }, [k])

  return schema ? <ItemConfigurer>
    <Schema
      ref={ref}
      model={schema}
      value={value}
      onChange={v => window.evalerValueEmitter.emit(k, v)}
    />
    {!configure.actualTimeVerify && <>
      <button onClick={async () => {
        await ref.current?.verify()
      }}>
        verify
      </button>
    </>}
  </ItemConfigurer> : null
}

document.querySelectorAll<HTMLDivElement>('.schema-eval-container')
  .forEach(el => {
    const { key = '', code, configure = '{}' } = el.dataset
    const configureObj = configure ? JSON.parse(configure) : undefined

    ReactDOM
      .createRoot(el)
      .render(<React.StrictMode>
        <Demo k={key} c={code} configure={configureObj} />
      </React.StrictMode>)
  })
