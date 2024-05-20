import type { Context } from './context'
import type { Framework, FrameworkKeys, Matcher, UnitMap, UnitProps } from './plugin'
import type { AllType, TypeMap } from './type'

/* eslint-disable @typescript-eslint/no-unused-vars */
export interface UnitFrameworksComp<
  N extends keyof UnitMap = keyof UnitMap,
  Props = {}
> {
/* eslint-enable @typescript-eslint/no-unused-vars */
  [key: FrameworkKeys]: unknown
}

export interface DefineUnit<
  PluginName extends string = string,
  FK extends FrameworkKeys = never,
  This = [FK] extends [never]
    ? Context<PluginName>
    : Framework<FK, PluginName>
> {
  <
    N extends keyof UnitMap,
    T extends AllType
  >(
    this: This,
    name: N,
    types: T[],
    matchers: Matcher<
      [FK] extends [never] ? never : UnitFrameworksComp<
        N,
        & Omit<UnitProps<T, TypeMap[T]>, keyof UnitMap[N]['props']>
        & UnitMap[N]['props']
      >[FK],
      N,
      T
    >[]
  ): This
  composer<T extends AllType>(this: This, types: T[], matchers: Matcher[]): This
  switcher<T extends AllType>(this: This, types: T[], matchers: Matcher[]): This
}

export function createDefineUnit<
  PluginName extends string = string,
  FK extends FrameworkKeys = never,
  This = FK extends never
    ? Context<PluginName>
    : Framework<FK, PluginName>
>(
  ctx: Context<PluginName>,
  framework?: Framework<FK>
) {
  type DU = DefineUnit<PluginName, FK, This>
  const innerThis = (framework ?? ctx) as This
  const prevKey = framework ? `framework.${framework.key}.units` : `units`
  let du = function (name, types, matchers) {
    const keys = types.map(type => `${prevKey}.${name}.${type}`)

    keys.forEach(k => {
      ctx.upd<typeof matchers>(
        k, (list = []) => {
          return list.concat(matchers)
        }, list => {
          return list.filter(m => !matchers.includes(m))
        }
      )
    })
    return this
  } as DU
  // bind will lose fields, so we need bind ctx when create du
  // bind type infer is not good, so we need to use `as` to fix it
  du = du.bind(innerThis) as DU
  du.composer = function () {
    // TODO set it to store
    return this
  }
  du.composer = du.composer.bind(innerThis)
  du.switcher = function () {
    // TODO set it to store
    return this
  }
  du.switcher = du.switcher.bind(innerThis)
  return du
}
