import { useEffect, useState } from 'react'

import type { Plugin } from './plugins'
import { plgMaster } from './plugins'

export function usePlugins(...plugins: (Plugin | (() => Plugin))[]) {
  const [inited, setInited] = useState(false)

  useEffect(() => {
    setInited(true)
    const dispatches = plugins.map(p => typeof p === 'function'
      ? plgMaster.register(p())
      : plgMaster.register(p)
    )
    return () => {
      setInited(false)
      dispatches.forEach(func => func())
    }
  }, [plugins])

  return { inited }
}
