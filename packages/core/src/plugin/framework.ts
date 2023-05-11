import type { Context, Icons, SwitcherProps } from '@zodui/core'
import type { TypeMap } from '@zodui/core'

const PropsSymbol = Symbol('props')

export type AsProps<T = {}> = T & { [PropsSymbol]: unknown }

export interface ControllerPropsMap {
}

interface BuiltinControllerPropsMap {
  Array: Record<string, AsProps<SwitcherProps<TypeMap['ZodArray']>>>
  Color: Record<string, AsProps<SwitcherProps<TypeMap['ZodString']>>>
  String: Record<string, AsProps<SwitcherProps<TypeMap['ZodString']>>>
  Number: Record<string, AsProps<SwitcherProps<TypeMap['ZodNumber']>>>
  Boolean: Record<string, AsProps<SwitcherProps<TypeMap['ZodBoolean']>>>
  Date: Record<string, AsProps<SwitcherProps<TypeMap['ZodDate']>>>
}

type CalcPropsMap<Map> = {
  [K in keyof Map]: K extends keyof BuiltinControllerPropsMap
    ? {
      [KK in keyof Map[K]]: BuiltinControllerPropsMap[K][string] & Map[K][KK]
    }
    : {}
}

export type InnerControllerPropsMap<Map = {}> =
  & BuiltinControllerPropsMap
  & CalcPropsMap<ControllerPropsMap>
  & CalcPropsMap<Map>

export type CalcPaths<Map = ControllerPropsMap, PrevK extends string = never> = Map extends AsProps
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

// export type AllPathsTuple<Map = ControllerPropsMap, PrevK extends string[] = never> = Map extends AsProps
//   ? PrevK
//   : {
//     [K in (keyof Map & string)]:
//       | [K] extends [never] ? never : PrevK
//       | AllPathsTuple<Map[K], [PrevK] extends [never] ? [K] : [...PrevK, K]>
//   }[keyof Map & string]
//
// export type JoinString<T extends unknown[], RootCall = false> =
//   T extends [infer First extends string, ...infer Rest]
//     ? `${
//       RootCall extends false
//         ? (<G>() => G extends First ? 1 : 2) extends (<G>() => G extends string ? 1 : 2)
//           ? `:${First}` : `.${First}`
//         : First
//     }${JoinString<Rest>}`
//     : ''
//
// export type AllPaths<Map = ControllerPropsMap> = AllPathsTuple<Map> extends infer T extends string[]
//   ? JoinString<T, true>
//   : never

export type AllPaths<M> = CalcPaths<M> | CalcPaths<BuiltinControllerPropsMap>

export type RevealPropsByPath<
  Path extends string,
  Map = InnerControllerPropsMap
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
  K extends FrameworksKeys,
  N extends string = string,
  Components = Frameworks[K]['Components'],
  Controllers = Frameworks[K]['Controllers'],
> {
  constructor(
    private readonly key: K,
    private readonly ctx: Context<N>
  ) {
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
    P extends AllPaths<ControllerPropsMap & Controllers>,
    InnerProps = RevealPropsByPath<P, InnerControllerPropsMap<Controllers>>,
    Props = InnerProps extends AsProps<infer P> ? P : never
  >(path: P | (string & {}), Ctrl: FrameworkCtrl<Props>[K]) {
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
    /**
     * define framework special component func value to infer defineComp func type
     */
    Components: Record<string, any>
    Controllers: {
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface FrameworkCtrl<Props> {
  [key: string]: any
}

export type FrameworksKeys = keyof Frameworks & string
