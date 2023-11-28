import type { Matcher, PropsResolver, TypeMap, UnitFrameworksComp, UnitMap, UnitProps } from '@zodui/core'
import { useMemo } from 'react'

import { Rndr } from '../components'
import { useCoreContextField } from '../contexts'

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
      const resolveProps = (propsResolver: PropsResolver, props: Parameters<R>[0]) => typeof propsResolver === 'function'
        ? propsResolver(props)
        : propsResolver
      switch (typeof topMatchUnit) {
        case 'string':
          func = (props => <Rndr
            target={topMatchUnit}
            {...props}
          />) as R
          break
        case 'object':
          if (Array.isArray(topMatchUnit)) {
            const [target, propsResolver] = topMatchUnit
            func = (props => <Rndr
              target={target}
              {...resolveProps(propsResolver, props)}
            />) as R
          }
          break
        case 'function': {
          const [target, propsResolver] = topMatchUnit({
            modes,
            // FIXME
            modelType: type as never,
            ...(opts as {})
          })
          func = (props => <Rndr
            target={target}
            {...resolveProps(propsResolver, props)}
          />) as R
          break
        }
      }
      return func
    }
  }, [modes, opts, topMatchUnit, type])
  return (topRndr ?? matchUnit) as R
}
