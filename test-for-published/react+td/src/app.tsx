/* eslint-disable @typescript-eslint/no-restricted-imports */
import '@zodui/react/dist/index.css'
import '@zodui/components-lib-tdesign/dist/index.css'

import { TDesignComponentsLibForReact } from '@zodui/components-lib-tdesign/react'
import { Context } from '@zodui/core'
import { z } from '@zodui/core/external'
import type { ListRef } from '@zodui/react'
import { List } from '@zodui/react'
import { useEffect, useRef } from 'react'

export default function App() {
  useEffect(() => {
    const e0 = Context.global.use(TDesignComponentsLibForReact)
    return () => e0()
  }, [])
  const listRef = useRef<ListRef>()

  return <>
    Hello ZodUI!
    <br />
    <button onClick={() => listRef.current.reset()}>
      Reset
    </button>
    <List
      ref={listRef}
      model={z.object({
        foo: z.string().label('hi')
      })}
    />
  </>
}
