import { useEffect, useState } from 'react'

import { plgMaster, Plugin } from './plugins'

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
  }, [plgMaster, ...plugins])

  return { inited }
}
