import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'

import { ZodSchema } from 'zod'
import { Schema } from '@zodui/react'
import '@zodui/react/components-lib/tdesign'

function Demo({ k = '' }) {
  const [code, setCode] = useState<string>()
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
  return schema ? <Schema model={schema} /> : null
}

document.querySelectorAll<HTMLDivElement>('.schema-eval-container')
  .forEach(el => {
    const { key = '' } = el.dataset

    ReactDOM
      .createRoot(el)
      .render(<React.StrictMode>
        <Demo k={key} />
      </React.StrictMode>)
  })
