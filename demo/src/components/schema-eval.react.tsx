import React, { useEffect, useRef, useState } from 'react'

import { ZodSchema } from 'zod'
import { Context } from '@zodui/core'
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

export function Demo({
  k = '',
  c,
  configure: cc
}: DemoProps) {
  Context.global.use(() => import('@zodui/components-lib-tdesign')
    .then(({ TDesignComponentsLibForReact }) => TDesignComponentsLibForReact)
  )
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
