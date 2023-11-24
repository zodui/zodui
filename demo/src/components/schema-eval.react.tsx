import { TDesignComponentsLibForReact } from '@zodui/components-lib-tdesign'
import { Context } from '@zodui/core'
import { CommonPluginForReact } from '@zodui/plugin-common'
import type { ItemConfigure, ListRef } from '@zodui/react'
import { List, useItemConfigurer } from '@zodui/react'
import React, { useEffect, useRef, useState } from 'react'
import type { ZodSchema } from 'zod'

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
  useEffect(() => {
    const e0 = Context.global.use(TDesignComponentsLibForReact)
    const e1 = Context.global.use(CommonPluginForReact)
    return () => (e0(), e1())
  }, [])

  const { configure, ItemConfigurer } = useItemConfigurer(cc)

  const [code, setCode] = useState<string>(c ?? '')
  useEffect(() => onCodeChange(k, setCode), [k])

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

  const ref = useRef<ListRef>(null)

  const [value, setValue] = useState<any>(undefined)

  useEffect(() => {
    return evalerValueEmitter.on(`${k}::init`, setValue)
  }, [k])

  return schema ? <ItemConfigurer>
    <List
      ref={ref}
      model={schema}
      value={value}
      onChange={v => window.evalerValueEmitter.emit(k, v)}
    />
    {!configure.actualTimeVerify && <>
      <button onClick={() => ref.current?.verify()}>
        verify
      </button>
    </>}
  </ItemConfigurer> : null
}
