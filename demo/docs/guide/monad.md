# Monad

`Monad` 在 ZodUI 中用于描述某个元素对外只会提供一个交互形式，不存在多个值、类型之间的相互影响，只会对外提供并输出唯一的值，并通过唯一的 `Schema` 对其进行数据校验。

常见的属于改概念范畴内的有：

* primitive
* Date

除了上述所举出的例子，只要不需要进行复杂的数据、类型进行互相干涉的支持的情况都可以采用该描述进行扩展支持。比如：

* 在弹出层中通过某种计算规则生成唯一值的交互

* 在空间有限交互模式下通过数据拼接生成唯一值的交互

## Number

通用数字类型，支持自然数类型的值输入，包括 `Infinity`, `-Infinity` 这种特殊情况。

> 如需防止 `Infinity`, `-Infinity` 请设置 `max`, `min`。

支持的描述属性有：

* max
* min
* step
* mode
  * modes: `'input' | 'slider' | 'split'`

```typescript zodui:configure-preview
// configure
z.object({
  mode: z.union([
    z.literal('input'),
    z.literal('slider'),
    z.literal('split'),
  ]),
  max: z.number(),
  min: z.number(),
  step: z.number(),
})
// preview
import * as z from 'zod'

export default z
  .number()
  .max(__CONFIGURE__.max)
  .min(__CONFIGURE__.min)
  .step(__CONFIGURE__.step)
  .mode(__CONFIGURE__.mode)
```

## String

## Boolean

## Date
