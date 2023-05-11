import type { Context as InnerCoreContext, Icons } from '@zodui/core'
import { Context } from '@zodui/core'
import type { PropsWithChildren } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

import type { ReactFramework } from '../components'

const CoreContext = createContext<InnerCoreContext>(null)

export const CoreContextProvider = (props: PropsWithChildren) => {
  const ctx = useContext(CoreContext) ?? Context.global
  useEffect(() => {
  }, [])
  return <CoreContext.Provider value={ctx}>
    {props.children}
  </CoreContext.Provider>
}

export const useCoreContextField = <T, >(k: string) => {
  const ctx = useContext(CoreContext) ?? Context.global
  const [InnerTarget, onTargetChange] = ctx.get<T>(k)
  const [Target, setTarget] = useState<T>(() => InnerTarget)
  useEffect(() => {
    return onTargetChange((newTarget: T) => setTarget(() => newTarget))
  }, [onTargetChange])
  return Target
}

export const useCoreContextComponent = <
  K extends keyof ReactFramework['Components'],
  T extends ReactFramework['Components'][K]
>(k: K) => useCoreContextField<T>(`framework.react.components.${k}`)

export const useCoreContextIcon = <
  K extends Icons,
>(k: K | (string & {})) => useCoreContextField<ReactFramework['Icon']>(`framework.react.icons.${k}`)
