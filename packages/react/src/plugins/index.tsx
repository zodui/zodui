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

export interface SubControllerMap extends Record<string, {
  props: any
  options: any
}> {}

export type SubControllerMatcher<
  T extends AllType,
  MapT extends keyof SubControllerMap,
  SubController extends SubControllerMap[MapT],
> = CreateComponentMatcher<
  T,
  /** IsParams */
  & { modes: string[] }
  & SubController['options'],
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
}

export class PlgMaster {
  readonly plgs = Object.keys(AllTypes)
    .reduce((acc, key) => ({
      ...acc, [key]: [],
    }), {} as Record<AllType, Plugin[]>)
  register(plg: Plugin) {
    plg.componentMatchers.forEach((comp) => {
      comp.types.forEach((type) => {
        this.plgs[type].push(plg as any)
      })
    })
    return this
  }
}

export const plgMaster = new PlgMaster()
