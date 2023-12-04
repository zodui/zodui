/* eslint-disable comma-dangle */
import '@zodui/react/index.css'
import '@zodui/components-lib-tdesign/index.css'

import { TDesignComponentsLibForReact } from '@zodui/components-lib-tdesign/react'
import { Context } from '@zodui/core'
import { z } from '@zodui/core/external'
import type { ListRef } from '@zodui/react'
import { List } from '@zodui/react'
import i18next from 'i18next'
import { useEffect, useRef, useState } from 'react'
import { zodI18nMap } from 'zod-i18n-map'

import translation from './locales/zh-Hans.json'

i18next.init({
  lng: 'zh-Hans',
  resources: {
    'zh-Hans': { zod: translation }
  }
})
z.setErrorMap(zodI18nMap)

export default function App() {
  useEffect(() => {
    const e0 = Context.global.use(TDesignComponentsLibForReact)
    return () => e0()
  }, [])
  const listRef = useRef<ListRef>()
  const [value, setValue] = useState({
    boz: { path: '2' }
  })

  return <>
    <List
      ref={listRef}
      model={z.object({
        // foo: z.string(),
        // fuo: z.string().default('1'),
        // bbr: z.array(z.string()),
        // bcr: z.map(z.string(), z.string()),
        bar: z.record(z.string()),
        // bmr: z.array(z.object({
        //   path: z.boolean(),
        //   type: z.string()
        // })).mode('wrap'),
        // baz: z.union([z.string(), z.number()]),
        // bor: z.discriminatedUnion('type', [
        //   z.object({
        //     path: z.string(),
        //     type: z.literal('1')
        //   }),
        //   z.object({
        //     path: z.string(),
        //     type: z.literal('2'),
        //     name: z.string()
        //   })
        // ]),
        // boz: z.object({
        //   path: z.string(),
        //   type: z.string()
        // }).mode('wrap'),
        // bkr: z.record(z.string(), z.string()),
      })}
      value={value}
      onChange={v => {
        console.log(v)
        setValue(v)
      }}
    />
  </>
}
