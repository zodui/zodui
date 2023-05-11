import type { AllType, ModesMap, TypeMap } from '@zodui/core'
import type { ReactElement } from 'react'

import type { ControllerProps } from '../controllers'

export interface ComponentMatcher<
  T extends AllType,
  IsParams extends any[],
  Props,
> {
  types: T[]
  is(...params: IsParams): boolean
  Component(props: Props): ReactElement
}

export interface SubControllerMap {}

export type SubControllerMatcher<
  T extends AllType,
  MapT extends keyof SubControllerMap,
  SubController extends SubControllerMap[MapT] = SubControllerMap[MapT],
> = ComponentMatcher<
  T,
  /** IsParams */
  [modes: string[], options?: SubController['options']],
  /** Component Props */
  & ControllerProps<TypeMap[T]>
  // @ts-ignore
  & { modes?: (ModesMap[T] | (string & {}))[] }
  & SubController['props']
>

export class Plugin {
  subControllerMatchersMap: Record<string, ComponentMatcher<any, any, any>[]> = {}
  newSubControllerMatcher<
    T extends AllType,
    N extends keyof SubControllerMap & string,
    M extends SubControllerMatcher<T, N>
  >(
    name: N,
    types: M['types'],
    array: [M['is'], M['Component']][]
  ) {
    this.subControllerMatchersMap[name] = this.subControllerMatchersMap[name] || []
    for (const [is, Component] of array) {
      this.subControllerMatchersMap[name].push({
        is,
        types,
        // @ts-ignore FIXME
        Component
      })
    }
    return this
  }
}

type RevealType = `SubController.${keyof SubControllerMap}`

type InferComponentMatcher<
  T extends AllType,
  N extends RevealType
> =
  N extends `SubController.${infer Name extends keyof SubControllerMap}`
  ? SubControllerMatcher<T, Name>
  : never

type InferIsParams<
  CM extends ComponentMatcher<any, any, any>
> =
  CM extends ComponentMatcher<any, infer P, any> ? P : never

export class PlgMaster {
  private quickMap = new Map<string, Set<ComponentMatcher<any, any, any>>>()
  private quickMapKeyGen = (name: RevealType, type: AllType) => [name, type].join(':--:')
  register(plg: Plugin) {
    // TODO simplify register and recycle logic
    Object.entries(plg.subControllerMatchersMap)
      .forEach(([name, matchers]) => {
        matchers.forEach(matcher => {
          matcher.types.forEach(type => {
            const key = this.quickMapKeyGen(`SubController.${name}` as RevealType, type)
            if (!this.quickMap.has(key)) {
              this.quickMap.set(key, new Set())
            }
            this.quickMap.get(key)?.add(matcher)
          })
        })
      })
    return () => {
      Object.entries(plg.subControllerMatchersMap)
        .forEach(([name, matchers]) => {
          matchers.forEach(matcher => {
            matcher.types.forEach(type => {
              const key = this.quickMapKeyGen(`SubController.${name}` as RevealType, type)
              this.quickMap.get(key)?.delete(matcher)
            })
          })
        })
    }
  }
  reveal<
    T extends AllType,
    N extends RevealType,
    CM extends InferComponentMatcher<T, N>,
    IsParam extends InferIsParams<CM>
  >(
    type: T,
    name: N,
    isParams: IsParam
  ) {
    const key = this.quickMapKeyGen(name, type)
    return [
      ...this.quickMap.get(key)?.values() ?? []
    ]
      .find(matcher => matcher.is(...isParams)) as CM | undefined
  }
}

export const plgMaster = new PlgMaster()
