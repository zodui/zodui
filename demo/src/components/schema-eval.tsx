import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'

import z from 'zod'
import { Schema } from '@zodui/react'
import '@zodui/react/components-lib/tdesign'

window.z = z

function Demo({ k = '' }) {
  const [[schema] = [], setSchema] = React.useState<[z.Schema]>()
  useEffect(() => {
    return onCodeChange(k, function (code: string) {
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

document.querySelectorAll<HTMLDivElement>('.schema-eval-container')
  .forEach(el => {
    const { key } = el.dataset
    ReactDOM
      .createRoot(el)
      .render(<React.StrictMode>
        <Demo k={key} />
      </React.StrictMode>)
  })
