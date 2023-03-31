import { ReactElement } from 'react'

import { ControllerProps } from '../controllers'
import { AllType, AllTypes, TypeMap } from '../utils'
import { ModesMap } from '../zod.external'

import { MultipleType } from '../controllers/multiple'
import { BaseCompProps } from '../components/base'

export type UnionProps<T extends AllType> = T extends 'ZodUnion' ? {
  options: BaseCompProps.SelectOptions[]
  OptionRender: ReactElement
} : {}

export type ListProps<T extends AllType> = T extends MultipleType ? {
  schemas: TypeMap[AllType][]
} : {}

export type ListIsOptions<T extends AllType> = T extends MultipleType ? {
  schemas: TypeMap[AllType][]
} : {}

export interface ComponentMatcher<T extends AllType = AllType> {
  types: T[]
  is: (modes: string[], options?: & {}
                                  & ListIsOptions<T>
  ) => boolean
  Component: (props: & ControllerProps<TypeMap[T]>
                     // @ts-ignore
                     & { modes?: ModesMap[T][] }
                     & ListProps<T>
                     & UnionProps<T>
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
