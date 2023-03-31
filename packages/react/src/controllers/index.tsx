import { Schema } from 'zod'
import { Primitive, primitive } from './primitive'
import { AllTypes, isWhatType, TypeMap, useDefaultValue } from '../utils'
import { Union } from './union'
import { List } from './list'
import { ReactElement } from 'react'

export interface ControllerProps<T extends Schema = Schema> {
  schema: T
  defaultValue?: any
  value?: any
  onChange?: (value: any) => void
  disabled?: boolean
  className?: string
}

export function Controller(props: ControllerProps) {
  const defaultValue = useDefaultValue(props.schema) ?? props.defaultValue
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

  // TODO support literal type display
  return primitive.includes(props.schema.type)
    // TODO resolve any as right type
    ? <Primitive {...props as any} />
    : isWhatType(props.schema, AllTypes.ZodUnion)
    ? <Union {...props as any} />
    : ['array', 'tuple', 'record', 'dict', 'object'].includes(props.schema.type)
    ? <List {...props as any} />
    : <span style={{ width: '100%' }}>暂未支持的的类型 <code>{props.schema.type}</code></span>
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
  Datetime: Record<string, AsProps<ControllerProps<TypeMap['ZodDate']>>>
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

export type AllPaths<Map = ControllerPropsMap, PrevK extends string = never> = Map extends AsProps
  ? PrevK
  : {
    [K in (keyof Map & string)]:
      | [K] extends [never] ? never : PrevK
      | AllPaths<Map[K], [PrevK] extends [never] ? K : `${PrevK}.${K}`>
  }[keyof Map & string]

type T0 = AllPaths<BuiltinControllerPropsMap> | AllPaths
//   ^?

const t0: T0 = 'Number.Slider'

type RevealPropsByPath<Path extends string, Map = InnerControllerPropsMap> = Path extends `${infer Key}.${infer Rest}`
  ? Key extends keyof Map
    ? Map[Key] extends Record<string, any>
      ? RevealPropsByPath<Rest>
      : never
    : never
  : Path extends keyof Map
    ? Map[Path] extends Record<string, any>
      ? Map[Path][string]
      : Map[Path]
    : never

type ResolveAsMap<M = InnerControllerPropsMap> = Partial<{
  [K in keyof M]: M[K] extends AsProps
    ? (props: M[K]) => ReactElement
    : ResolveAsMap<M[K]>
}>

const ControllerMap: ResolveAsMap = {}

// export function registerController<P extends AllPaths>(path: P | (string & {}), Controller: (props: RevealPropsByPath<P>) => ReactElement) {
//   const pathArr = path.split('.')
//   let target = ControllerMap
//   for (let i = 0; i < pathArr.length; i++) {
//     const key = pathArr[i]
//     if (i === pathArr.length - 1) {
//       target[key] = Controller
//     } else {
//       if (typeof target[key] === 'undefined') {
//         target[key] = {}
//       }
//       target = target[key] as any
//     }
//   }
// }

// export function ControllerRender({
//   target,
//   ...props
// }: {
//   target: string
// } & Record<string, any>) {
//   const errorHandler = useErrorHandlerContext()
//   const path = target.split('.')
//   let TargetComp = ControllerMap
//   for (let i = 0; i < path.length; i++) {
//     const key = path[i]
//     TargetComp = TargetComp[key] as any
//   }
//   if (!TargetComp) {
//     return errorHandler.throwError(`Controller ${target} not found`)
//   }
//   if (typeof TargetComp !== 'function') {
//     return errorHandler.throwError(`Controller ${target} is not a function`)
//   }
//   // @ts-ignore FIXME
//   return <TargetComp {...props}/>
// }
