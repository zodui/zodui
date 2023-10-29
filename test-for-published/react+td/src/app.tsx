/* eslint-disable @typescript-eslint/no-restricted-imports */
import '@zodui/react/dist/index.css'
import '@zodui/components-lib-tdesign/dist/index.css'

import { Context } from '@zodui/core'
import { List } from '@zodui/react'
import { useEffect, useState } from 'react'
import { z } from 'zod'

export default function App() {
  const [ctxInited, setCtxInited] = useState(false)
  useEffect(() => {
    // let flag = false
    const e0 = Context.global.use(() => import('@zodui/components-lib-tdesign/react')
      .then(({ TDesignComponentsLibForReact }) => {
        setCtxInited(true)
        // flag
        //   ? setCtxInited(true)
        //   : (flag = true)
        return TDesignComponentsLibForReact
      })
    )
    // const e1 = Context.global.use(() => import('@zodui/plugin-common')
    //   .then(({ CommonPluginForReact }) => {
    //     flag
    //       ? setCtxInited(true)
    //       : (flag = true)
    //     return CommonPluginForReact
    //   })
    // )
    return () => e0()
  }, [])

  return <>
    Hello ZodUI!
    {ctxInited && <List model={z.object({
      foo: z.string()
    })}/>}
  </>
}
