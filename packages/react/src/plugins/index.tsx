import { ReactElement } from 'react'

import { ControllerProps } from '../controllers'
import { AllType, AllTypes, TypeMap } from '../utils'
import { ModesMap } from '../zod.external'

import { MultipleType } from '../controllers/multiple'
import { BaseCompProps } from '../components/base'

export type ComplexProps<T extends AllType> = T extends 'ZodUnion' ? {
  options: BaseCompProps.SelectOptions[]
  OptionRender: ReactElement
} : {}

export type MultipleProps<T extends AllType> = T extends MultipleType ? {
  schemas: TypeMap[AllType][]
} : {}

export type MultipleOptions<T extends AllType> = T extends MultipleType ? {
  schemas: TypeMap[AllType][]
} : {}

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

export interface ComponentMatcher<T extends AllType = AllType> {
  types: T[]
  is: (modes: string[], options?: & {}
                                  & MultipleOptions<T>
  ) => boolean
  Component: (props: & ControllerProps<TypeMap[T]>
                     // @ts-ignore
                     & { modes?: ModesMap[T][] }
                     & MultipleProps<T>
                     & ComplexProps<T>
  ) => ReactElement
}

export class Plugin {
  componentMatchers: ComponentMatcher[] = []
  addSubController<T extends AllType, C extends ComponentMatcher<T> = ComponentMatcher<T>>(
    types: C['types'],
    array: [C['is'], C['Component']][]
  ) {
    array
      .forEach(([is, Component]) => this.componentMatchers.push({
        // @ts-ignore FIXME
        is,
        types,
        // @ts-ignore FIXME
        Component
      }))
    return this
  }
  subControllerMatchersMap: Record<string, ComponentMatcher[]> = {}
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
  private quickMap = new Map<string, CreateComponentMatcher<any, any, any>[]>()
  private quickMapKeyGen = (name: RevealType, type: AllType) => [name, type].join(':--:')
  register(plg: Plugin) {
    plg.componentMatchers.forEach((comp) => {
      comp.types.forEach((type) => {
        this.plgs[type].push(plg as any)
      })
    })
    Object.entries(plg.subControllerMatchersMap)
      .forEach(([name, matchers]) => {
        matchers.forEach(matcher => {
          matcher.types.forEach(type => {
            const key = this.quickMapKeyGen(`SubController.${name}` as RevealType, type)
            if (!this.quickMap.has(key)) {
              this.quickMap.set(key, [])
            }
            this.quickMap.get(key)?.push(matcher)
          })
        })
      })
    return () => {
      plg.componentMatchers.forEach((comp) => {
        comp.types.forEach((type) => {
          const index = this.plgs[type].indexOf(plg as any)
          this.plgs[type].splice(index, 1)
        })
      })
      Object.entries(plg.subControllerMatchersMap)
        .forEach(([name, matchers]) => {
          matchers.forEach(matcher => {
            matcher.types.forEach(type => {
              this.quickMap.delete([`SubController.${name}`, type].join(':--:'))
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
    const matchers = this.quickMap
      .get([name, type].join(':--:'))
      ?? []
    return matchers
      .find(matcher => matcher.is(...isParams))
  }
}

export const plgMaster = new PlgMaster()
