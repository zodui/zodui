import { ReactElement } from 'react'

import { ControllerProps } from '../controllers'
import { AllType, AllTypes, TypeMap } from '../utils'
import { ModesMap } from '../zod.external'

export interface CreateComponentMatcher<
  T extends AllType,
  IsParams extends any[],
  Props extends any,
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
> = CreateComponentMatcher<
  T,
  /** IsParams */
  [modes: string[], options?: SubController['options']],
  /** Component Props */
  & ControllerProps<TypeMap[T]>
  // @ts-ignore
  & { modes?: ModesMap[T][] }
  & SubController['props']
>

export class Plugin {
  subControllerMatchersMap: Record<string, CreateComponentMatcher<any, any, any>[]> = {}
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

export class PlgMaster {
  readonly plgs = Object.keys(AllTypes)
    .reduce((acc, key) => ({
      ...acc, [key]: [],
    }), {} as Record<AllType, Plugin[]>)
  private quickMap = new Map<string, Set<CreateComponentMatcher<any, any, any>>>()
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
    N extends RevealType
  >(
    type: T,
    name: N,
    isParams: [modes: string[]]
  ) {
    return [
      ...this.quickMap.get([name, type].join(':--:'))?.values() ?? []
    ]
      .find(matcher => matcher.is(...isParams))
  }
}

export const plgMaster = new PlgMaster()
