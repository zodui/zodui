import { TDesignComponentsLibForReact } from '@zodui/components-lib-tdesign'
import { Context } from '@zodui/core'
import { CommonPluginForReact } from '@zodui/plugin-common'
import { useEffect, useRef } from 'react'

import { portalMetas } from './potalMetas'

export function ReactApp() {
  const firstRender = useRef(true)
  if (firstRender.current) {
    firstRender.current = false
    // createPortal is not cleared innerHTML of elements
    portalMetas.forEach(([el]) => {
      el.innerHTML = ''
    })
  }
  useEffect(() => {
    const e0 = Context.global.use(TDesignComponentsLibForReact)
    const e1 = Context.global.use(CommonPluginForReact)
    return () => {
      e0()
      e1()
    }
  }, [])
  return <>
    {portalMetas.map(([, p]) => p)}
  </>
}
