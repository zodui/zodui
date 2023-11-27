import type { AllType, ComponentProps, TypeMap } from '@zodui/core'

import type { Context } from '../context'

export * from './base'
export type {
  ComponentProps,
  FrameworkComponents,
  Icons
} from './components'
export * from './framework'

type Rule<N extends keyof UnitMap> =
  | string[]
  | [N] extends [never]
    ? { (modes: string[]): boolean }
    : { (modes: string[], opts?: UnitMap[N]['options']): boolean }

type MatcherRndr<
  C,
  N extends keyof UnitMap = never
> =
  | string
  | (
    [C] extends [never]
      // When the component is not set, returns a function that takes props and returns a component Rndr String and its props
      ? ((
        props:
          & { modes: string[] }
          & UnitMap[N]['options']
      ) => [rndrTarget: string, props: Record<string, any>])
      : C
  )
  | [rndrTarget: string, props: Record<string, any>]

export type Matcher<
  C = never,
  N extends keyof UnitMap = never
> =
  | [rule: Rule<N>, rndr: MatcherRndr<C, N>]

export interface UnitMap {
  [key: string]: {
    props: unknown
    options: unknown
  }
  monad: {
    props: {}
    options: {}
  }
  complex: {
    props: {
      options: ComponentProps.Option[]
      OptionRender: any
    }
    options: {
      model: TypeMap[AllType]
    }
  }
  multiple: {
    props: {
      schemas: TypeMap[AllType][]
      onChange?: (value: any[]) => void | Promise<void>
    }
    options: {
      schemas: TypeMap[AllType][]
    }
  }
}

export interface Plugin<N extends string = string> {
  name: N
  call: (ctx: Context) => void
}

export function definePlugin(
  name: Plugin['name'],
  call: Plugin['call']
): Plugin {
  return { name, call }
}
