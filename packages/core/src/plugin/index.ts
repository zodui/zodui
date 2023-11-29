import type { AllType, ComponentProps, TypeMap, UnitProps } from '@zodui/core'

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

export type PropsResolver<
  N extends keyof UnitMap = never,
  T extends AllType = never
> = Record<string, any> | ((
  props:
    & Omit<UnitProps<T, TypeMap[T]>, keyof UnitMap[N]['props']>
    & UnitMap[N]['props']
) => Record<string, any>)

type MatcherRndr<
  C,
  N extends keyof UnitMap = never,
  T extends AllType = never
> =
  | string
  | (
    [C] extends [never]
      // When the component is not set, returns a function that takes props and returns a component Rndr String and its props
      ? ((
        opts:
          & { modes: string[] }
          & { modelType: T }
          & UnitMap[N]['options']
      // TODO infer rndr props by target
      ) => [rndrTarget: string, rndrProps: PropsResolver<N, T>])
      : C
  )
  | [rndrTarget: string, rndrProps: PropsResolver<N, T>]

export type Matcher<
  C = never,
  N extends keyof UnitMap = never,
  T extends AllType = never
> =
  | [rule: Rule<N>, rndr: MatcherRndr<C, N, T>]

export interface UnitMap<
  // TODO support get value type from generic by higher order function
  // M extends ZodSchema = any,
  // V = TypeOf<M>
> {
  [key: string]: {
    props: unknown
    options: unknown
  }
  monad: {
    props: {
    }
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
