import { AllTypes } from './utils'

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
