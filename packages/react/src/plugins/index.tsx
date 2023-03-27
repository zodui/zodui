import { ReactElement } from 'react'

import { ControllerProps } from '../controller'
import { AllType, AllTypes, TypeMap } from '../utils'

export interface UnionOptions {
  label: string
  title: string
  value: any
}

export type UnionProps<T extends AllType> = T extends 'ZodUnion' ? {
  options: UnionOptions[]
} : {}

export interface PluginComp<T extends AllType = AllType> {
  types: T[]
  is: (modes: string[]) => boolean
  Component: (props: & ControllerProps<TypeMap[T]>
                     & UnionProps<T>) => ReactElement
}

export class Plugin {
  compMatchers: PluginComp[] = []
  addComp<T extends AllType, C extends PluginComp<T> = PluginComp<T>>(
    types: C['types'],
    array: [C['is'], C['Component']][]
  ) {
    array
      .forEach(([isMatch, Component]) => this.compMatchers.push({
        types, is: isMatch,
        // @ts-ignore
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
    plg.compMatchers.forEach((comp) => {
      comp.types.forEach((type) => {
        this.plgs[type].push(plg as any)
      })
    })
    return this
  }
}

export const plgMaster = new PlgMaster()
