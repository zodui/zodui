import type { Matcher, TypeMap, UnitFrameworksComp, UnitMap, UnitProps } from '@zodui/core'
import { useMemo } from 'react'

import { Rndr } from './components'
import { useCoreContextField } from './contexts'

export function useCoreContextUnit<
  N extends keyof UnitMap,
  T extends keyof TypeMap,
  R extends UnitFrameworksComp<
    N,
    & Omit<UnitProps<T, TypeMap[T]>, keyof UnitMap[N]['props']>
    & UnitMap[N]['props']
  >['react']
>(
  name: N,
  type: T,
  modes: string[],
  opts?: UnitMap[N]['options']
): R {
  const suffix = `${name}.${type}`
  const topMatchers = useCoreContextField<Matcher[]>(`units.${suffix}`)
  const matchers = useCoreContextField<
    Matcher<UnitFrameworksComp['react']>[]
  >(`framework.react.units.${suffix}`)

  const [, topMatchUnit] = useMemo(
    () => topMatchers?.find(([match]) => match(modes, opts)) ?? [], [
      topMatchers,
      modes,
      opts
    ]
  )
  const [, matchUnit] = useMemo(
    () => matchers?.find(([match]) => match(modes, opts)) ?? [], [
      matchers,
      modes,
      opts
    ]
  )
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
