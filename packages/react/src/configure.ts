import { AllTypes, Mutable } from './utils'

/**
 * 为了设置 wrap 的默认值
 *
 * 在其他对应 control 组件中引入该变量，并 push 将其默认设置为 wrap 换行模式
 * 该种默认设置后，可以通过传入 `no-wrap` 使得其不换行
 * 例如：
 * ```js
 * import { NeedWrapModes } from 'zodui-react'
 * NeedWrapModes.push('code', /^code/)
 * ```
 */
export const WrapModes: (string | RegExp)[] = []

/**
 * 复合 schema 的类型
 */
export const ComplexMultipleTypes = [AllTypes.ZodTuple, AllTypes.ZodObject]

/**
 * 可修改 key 的值的类型
 */
export const KeyEditableTypes = [AllTypes.ZodRecord, AllTypes.ZodMap]

const innerMonad = [
  AllTypes.ZodString,
  AllTypes.ZodNumber,
  AllTypes.ZodBoolean,
  AllTypes.ZodDate
] as const

export const monad = innerMonad as Mutable<typeof innerMonad>

export type MonadType = (typeof monad)[number]

const innerComplexTypes = [
  AllTypes.ZodUnion
] as const

export const complex = innerComplexTypes as Mutable<typeof innerComplexTypes>

export type ComplexType = (typeof complex)[number]

const innerMultipleTypes = [
  AllTypes.ZodArray,
  AllTypes.ZodTuple,
  AllTypes.ZodSet,
  AllTypes.ZodMap,
  AllTypes.ZodRecord,
  AllTypes.ZodObject,
] as const

export const multiple = innerMultipleTypes as Mutable<typeof innerMultipleTypes>

export type MultipleType = (typeof multiple)[number]
