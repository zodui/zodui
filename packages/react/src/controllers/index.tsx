import './index.scss'

import { ReactElement, useMemo } from 'react'
import z, { Schema, ZodTypeDef } from 'zod'
import { Monad } from './monad'
import {
  AllType,
  AllTypes,
  isWhatType,
  isWhatTypes,
  TypeMap,
} from '@zodui/core'
import { useErrorHandlerContext, useControllerClassName } from '@zodui/react'
import {
  useDefaultValue,
  useModes
} from '../utils'
import { Complex } from './complex'
import { Multiple } from './multiple'
import { monad, complex, multiple } from '../configure'

function isMatchSubControllersWhatTypes<T extends AllType>(
  types: T[],
  tuple: readonly [
    z.Schema<any, ZodTypeDef & {
      typeName?: AllType
    }, any>,
    (props: ControllerProps<any>) => ReactElement
  ]
): tuple is [TypeMap[T], (props: ControllerProps<TypeMap[T]>) => ReactElement] {
  const [ s ] = tuple
  return isWhatTypes(s, types)
}

export interface ControllerProps<T extends Schema = Schema> {
  uniqueKey?: string
  modes?: string[]
  schema: T
  defaultValue?: any
  value?: any
  onChange?: (value: any) => void
  disabled?: boolean
  className?: string
}

/**
 * Controller will try to resolve all schema and render it
 */
export function Controller(props: ControllerProps) {
  const { className: subClassName, ControllerClassName } = useControllerClassName()
  // props defaultValue is higher than schema defaultValue
  // because Component is user controlled
  // but schema defaultValue is not user controlled, so we should use props defaultValue first
  const defaultValue = props.defaultValue ?? useDefaultValue(props.schema)
  if (isWhatType(props.schema, AllTypes.ZodDefault)) {
    const {
      innerType,
      defaultValue: _,
      typeName: __,
      ...assignDefFields
    } = props.schema._def
    Object.assign(innerType._def, assignDefFields)
    return <Controller
      {...props}
      schema={innerType}
      defaultValue={defaultValue}
    />
  }
  if (isWhatType(props.schema, AllTypes.ZodOptional)) {
    const {
      innerType,
      typeName: __,
      ...assignDefFields
    } = props.schema._def
    Object.assign(innerType._def, assignDefFields)
    return <Controller
      {...props}
      schema={innerType}
    />
  }

  const { schema, ...rest } = props

  // TODO resolve parent modes?
  const modes = useModes(schema)

  // TODO support literal type display
  const subControllers = [
    ['monad', monad, Monad],
    ['complex', complex, Complex],
    ['multiple', multiple, Multiple]
  ] as const

  const SubController: ReactElement = useMemo(() => {
    for (const [name, types, SubController] of subControllers) {
      // let ts happy
      const checkTuple = [schema, SubController] as const
      if (isMatchSubControllersWhatTypes(types, checkTuple)) {
        const [schema, SubController] = checkTuple
        return <div className={`zodui-controller ${name} ${schema.type} ${subClassName}`}>
          <ControllerClassName>
            <SubController schema={schema} modes={modes} {...rest} />
          </ControllerClassName>
        </div>
      }
    }
    return null
  }, [schema, modes, rest, subClassName])

  return SubController
    ? SubController
    : <div className='zodui-controller'>
      <span style={{ width: '100%' }}>暂未支持的的类型 <code>{props.schema.type}</code></span>
    </div>
}

const PropsSymbol = Symbol('props')

export type AsProps<T = {}> = T & { [PropsSymbol]: unknown }

export interface ControllerPropsMap {
}

interface BuiltinControllerPropsMap {
  Array: Record<string, AsProps<ControllerProps<TypeMap['ZodArray']>>>
  Color: Record<string, AsProps<ControllerProps<TypeMap['ZodString']>>>
  String: Record<string, AsProps<ControllerProps<TypeMap['ZodString']>>>
  Number: Record<string, AsProps<ControllerProps<TypeMap['ZodNumber']>>>
  Boolean: Record<string, AsProps<ControllerProps<TypeMap['ZodBoolean']>>>
  Date: Record<string, AsProps<ControllerProps<TypeMap['ZodDate']>>>
}

type InnerControllerPropsMap =
  & BuiltinControllerPropsMap
  & {
    [K in keyof ControllerPropsMap]: K extends keyof BuiltinControllerPropsMap
      ? {
        [KK in keyof ControllerPropsMap[K]]: BuiltinControllerPropsMap[K][string] & ControllerPropsMap[K][KK]
      }
      : {}
  }

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

type AllPaths = CalcPaths | CalcPaths<BuiltinControllerPropsMap>

type RevealPropsByPath<Path extends string, Map = InnerControllerPropsMap> = Path extends `${infer Key}${'.' | ':'}${infer Rest}`
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

type ResolveAsMap<M = InnerControllerPropsMap> = Partial<{
  [K in keyof M]: M[K] extends AsProps
    ? (props: M[K]) => ReactElement
    : ResolveAsMap<M[K]>
}>

// TODO refactor it
//      let Map = window.__ZODUI_CONTROLLER_MAP__, because hot module reload will cause Map to be undefined
//      hmr unable know Map will be use in other module, such as `components-lib/tdesign.tsx`
//      so we need to use `window.__ZODUI_CONTROLLER_MAP__` to store Map
//      it may cause some problem, so we need to refactor it
// @ts-ignore
window.__ZODUI_CONTROLLER_MAP__ = window.__ZODUI_CONTROLLER_MAP__ || {}

const ControllerMap: ResolveAsMap
  // @ts-ignore
  = window.__ZODUI_CONTROLLER_MAP__

export function addController<
  P extends AllPaths,
  InnerProps = RevealPropsByPath<P>,
  Props = InnerProps extends AsProps<infer P> ? P : never
>(path: P | (string & {}), Controller: (props: Props) => ReactElement) {
  const pathArr = path.replace(':', '.').split('.')
  let target = ControllerMap as any
  for (let i = 0; i < pathArr.length; i++) {
    const key = pathArr[i]
    if (i === pathArr.length - 1) {
      target[key] = Controller
    } else {
      if (typeof target[key] === 'undefined') {
        target[key] = {}
      }
      target = target[key]
    }
  }
}

export function ControllerRender<
  P extends AllPaths,
  InnerProps = RevealPropsByPath<P>,
  Props = InnerProps extends AsProps<infer P> ? P : never
>({
  target,
  ...props
}: {
  target: P | (string & {})
} & Props) {
  const errorHandler = useErrorHandlerContext()
  const path = target.replace(':', '.').split('.')
  let TargetComp = ControllerMap as (() => ReactElement) | Record<string, () => ReactElement>
  for (let i = 0; i < path.length; i++) {
    const key = path[i]
    if (typeof TargetComp === 'object') {
      TargetComp = TargetComp[key]
    }
  }
  if (!TargetComp) {
    return errorHandler.throwError(`Controller ${target} not found`)
  }
  if (typeof TargetComp !== 'function') {
    return errorHandler.throwError(`Controller ${target} is not a function`)
  }
  return <TargetComp {...props} />
}
