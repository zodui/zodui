/* eslint-disable @typescript-eslint/no-restricted-imports */
import '@zodui/react/dist/index.css'

import { List } from '@zodui/react'
import { z } from 'zod'

export default function App() {
  return <>
    Hello ZodUI!
    123
    <List model={z.object({
      foo: z.string()
    })} />
  </>
}
