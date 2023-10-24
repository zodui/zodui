import type { Icons, SwitcherProps, TypeMap } from '@zodui/core'

import type { Context } from '../context'
import type { DefineUnit } from '../createDefineUnit'
import { createDefineUnit } from '../createDefineUnit'

const PropsSymbol = Symbol('props')

export type AsProps<T = {}> = T & { [PropsSymbol]: unknown }

export interface RenderPropsMap {
}

interface BuiltinRenderPropsMap {
  Array: Record<string, AsProps<SwitcherProps<TypeMap['ZodArray']>>>
  Color: Record<string, AsProps<SwitcherProps<TypeMap['ZodString']>>>
  String: Record<string, AsProps<SwitcherProps<TypeMap['ZodString']>>>
  Number: Record<string, AsProps<SwitcherProps<TypeMap['ZodNumber']>>>
  Boolean: Record<string, AsProps<SwitcherProps<TypeMap['ZodBoolean']>>>
  Date: Record<string, AsProps<SwitcherProps<TypeMap['ZodDate']>>>
  Range: Record<string, AsProps<SwitcherProps<TypeMap['ZodTuple']>>>
}

type CalcPropsMap<Map> = {
  [K in keyof Map]: K extends keyof BuiltinRenderPropsMap
    ? {
      [KK in keyof Map[K]]: BuiltinRenderPropsMap[K][string] & Map[K][KK]
    }
    : {}
}

export type InnerRenderPropsMap<Map = {}> =
  & BuiltinRenderPropsMap
  & CalcPropsMap<RenderPropsMap>
  & CalcPropsMap<Map>

export type CalcPaths<Map = RenderPropsMap, PrevK extends string = never> = Map extends AsProps
  ? PrevK
  : {
    [K in (keyof Map & string)]:
      | [K] extends [never] ? never : PrevK
      | CalcPaths<Map[K], [PrevK] extends [never] ? K : `${PrevK}${
        // Equal
        (<G>() => G extends K ? 1 : 2) extends (<G>() => G extends string ? 1 : 2)
          ? `.${K}`
          : `:${K}`
      }`>
  }[keyof Map & string]

export type AllPaths<M> = CalcPaths<M> | CalcPaths<BuiltinRenderPropsMap>

export type RevealPropsByPath<
  Path extends string,
  Map = InnerRenderPropsMap
> = Path extends `${infer Key}${'.' | ':'}${infer Rest}`
  ? Key extends keyof Map
    ? Map[Key] extends Record<string, any>
      ? RevealPropsByPath<Rest, Map[Key]>
      : never
    : never
  : Path extends keyof Map
    ? Map[Path] extends AsProps
      ? Map[Path]
      : Map[Path] extends Record<string, any>
        ? Map[Path][string]
        : never
    : never

export class Framework<
  K extends FrameworkKeys,
  N extends string = string,
  Components = Frameworks[K]['Components'],
  Renders = Frameworks[K]['Renders'],
> {
  defineUnit: DefineUnit<N, K>
  constructor(
    public readonly key: K,
    private readonly ctx: Context<N>
  ) {
    this.defineUnit = createDefineUnit(ctx, this)
  }
  defineComp<
    Type extends keyof Components & string,
  >(
    type: Type, Component: Components[Type]
  ) {
    this.ctx.set(`framework.${this.key}.components.${type}`, Component)
    return this
  }
  defineIcon<
    Icon extends Icons
  >(
    icon: Icon,
    Comp: Frameworks[K]['Icon']
  ) {
    this.ctx.set(`framework.${this.key}.icons.${icon}`, Comp)
    return this
  }
  defineRender<
    P extends AllPaths<RenderPropsMap & Renders>,
    InnerProps = RevealPropsByPath<P, InnerRenderPropsMap<Renders>>,
    Props = InnerProps extends AsProps<infer P> ? P : never
  >(path: P | (string & {}), Ctrl: FrameworkRndr<Props>[K]) {
    this.ctx.set(`framework.${this.key}.ctrls.${path}`, Ctrl)
    return this
  }
  defineRndr = this.defineRender
  // defineComposer(): Framework<K>
  // defineCpsr(): Framework<K>
  // defineDescriptor(): Framework<K>
  // defineDesc(): Framework<K>
  // defineSwitcher(): Framework<K>
  // defineSwch(): Framework<K>
  // defineUnit(): Framework<K>
}

export interface Frameworks {
  [key: string]: {
    Icon: any
    Renders: {}
    /**
     * define framework special component func value to infer defineComp func type
     */
    Components: Record<string, any>
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface FrameworkRndr<Props> {
  [key: string]: any
}

export type FrameworkKeys = keyof Frameworks & string
