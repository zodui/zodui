import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { Context, Context as InnerCoreContext } from '@zodui/core'

const CoreContext = createContext<InnerCoreContext>(null)

export const CoreContextProvider = (props: PropsWithChildren) => {
  const ctx = useContext(CoreContext) ?? Context.global
  useEffect(() => {
  }, [])
  return <CoreContext.Provider value={ctx}>
    {props.children}
  </CoreContext.Provider>
}

export const useCoreContextField = <T extends any>(k: string) => {
  const ctx = useContext(CoreContext) ?? Context.global
  const [InnerTarget, onTargetChange] = ctx.get<T>(k)
  const [Target, setTarget] = useState<T>(InnerTarget)
  useEffect(() => {
    return onTargetChange((newTarget: T) => setTarget(newTarget))
  }, [onTargetChange])
  return Target
}
