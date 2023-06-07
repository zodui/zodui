import type { Context as InnerCoreContext, Icons, Matcher, TypeMap, UnitFrameworksComp, UnitMap, UnitProps } from '@zodui/core'
import { Context } from '@zodui/core'
import type { PropsWithChildren } from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import type { ReactFramework } from '../components'
import { Rndr } from '../components'

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

export function useCoreContextUnit<
  N extends string,
  T extends keyof TypeMap,
  R extends UnitFrameworksComp<
    N,
    & Omit<UnitProps<T, TypeMap[T]>, keyof UnitMap[N]['props']>
    & UnitMap[N]['props']
  >['react']
>(
  name: N,
  type: T,
  modes: string[]
): R {
  const suffix = `${name}.${type}`
  const topMatchers = useCoreContextField<
    Matcher<never>[]
  >(`units.${suffix}`)
  const matchers = useCoreContextField<
    Matcher<UnitFrameworksComp['react']>[]
  >(`framework.react.units.${suffix}`)

  const [, topMatchUnit] = useMemo(
    () => topMatchers?.find(([match]) => match(modes)) ?? [], [
      topMatchers,
      modes
    ])
  const [, matchUnit] = useMemo(
    () => matchers?.find(([match]) => match(modes)) ?? [], [
      matchers,
      modes
    ])
  const topRndr = useMemo(() => {
    if (topMatchUnit) {
      let func: R
      switch (typeof topMatchUnit) {
        case 'string':
          func = (props => <Rndr
            target={topMatchUnit}
            {...props}
          />) as R
          break
        case 'object':
          if (Array.isArray(topMatchUnit)) {
            const [target, propsOrPropsFunc] = topMatchUnit
            func = (props => <Rndr
              target={target}
              {...(typeof propsOrPropsFunc === 'function' ? propsOrPropsFunc(props) : propsOrPropsFunc)}
            />) as R
          }
      }
      return func
    }
  }, [topMatchUnit])
  return (topRndr ?? matchUnit) as R
}
