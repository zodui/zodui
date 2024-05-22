import { z } from '@zodui/core/external'
import type { ItemConfigure, ListRef } from '@zodui/react'
import { List, useItemConfigurer } from '@zodui/react'
import i18next from 'i18next'
import React, { useEffect, useRef, useState } from 'react'
import type { ZodSchema } from 'zod'
import { zodI18nMap } from 'zod-i18n-map'
import translation from 'zod-i18n-map/locales/zh-CN/zod.json'

// TODO add more languages support
i18next.init({
  lng: 'zh-CN',
  resources: {
    'zh-CN': { zod: translation }
  }
})
z.setErrorMap(zodI18nMap)

interface DemoProps {
  k?: string
  c?: string

  configure?: ItemConfigure
}

export function Demo({
  k = '',
  c,
  configure: cc
}: DemoProps) {
  const { configure, ItemConfigurer } = useItemConfigurer(cc)

  const [code, setCode] = useState<string>(c ?? '')
  useEffect(() => onCodeChange(k, setCode), [k])

  const [[schema] = [], setSchema] = useState<[ZodSchema | ZodSchema[]]>()
  useEffect(() => {
    if (!code) return

    ;(async () => {
      try {
        const mjsEvalerURL = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }))
        const module = await import(/* @vite-ignore */ mjsEvalerURL)

        if (module.default)
          setSchema([module.default])
      } catch (e) {
        console.error(`key: ${k}\n`, code)
        console.error(e)
      }
    })()
  }, [k, code])

  const refs = useRef<ListRef[]>([])

  const [value, setValue] = useState<any>(undefined)

  useEffect(() => {
    return evalerValueEmitter.on(`${k}::init`, setValue)
  }, [k])

  return schema ? <ItemConfigurer>
    {Array.isArray(schema)
      ? schema.map((s, i) => <List
        key={i}
        ref={r => {
          if (r === null) return
          refs.current = [...refs.current, r]
        }}
        model={s}
        value={value}
        onChange={v => window.evalerValueEmitter.emit(k, v)}
      />)
      : <List
        ref={r => {
          if (r === null) return
          refs.current = [r]
        }}
        model={schema}
        value={value}
        onChange={v => window.evalerValueEmitter.emit(k, v)}
      />}
    {!configure.actualTimeVerify && <>
      <button onClick={() => Promise.all(refs.current.map(r => r.verify()))}>
        verify
      </button>
    </>}
  </ItemConfigurer> : <div className='empty'>loading...</div>
}
