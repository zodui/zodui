import '@zodui/react/components-lib/tdesign'

import type { Schema as ZodSchema } from 'zod'
import { useEffect, useState } from 'react'
import { Schema } from '@zodui/react'

export function SchemaReact() {
  const [[schema] = [], setSchema] = useState<[ZodSchema]>()
  useEffect(() => {
    return onCodeChange(function (code: string) {
      try {
        const s = eval(code)
        setSchema([s])
      } catch (e) {
        console.error(e)
      }
    })
  }, [])
  return schema ? <Schema model={schema} /> : null
}
