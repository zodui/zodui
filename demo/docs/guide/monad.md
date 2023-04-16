# Monad

`Monad` 在 ZodUI 中用于描述某个元素对外只会提供一个交互形式，不存在多个值、类型之间的相互影响，只会对外提供并输出唯一的值，并通过唯一的 `Schema` 对其进行数据校验。

常见的属于该概念范畴内的有：

* primitive
* Date

除了上述所举出的例子，只要不需要进行复杂的数据、类型进行互相干涉的支持的情况都可以采用该描述进行扩展支持。比如：

* 在弹出层中通过某种计算规则生成唯一值的交互

* 在空间有限交互模式下通过数据拼接生成唯一值的交互

## Number

通用数字类型，支持自然数类型的值输入，包括 `Infinity`, `-Infinity` 这种特殊情况。

> 如需防止 `Infinity`, `-Infinity` 请设置 `max`, `min`。

> `NaN` 为非数字类型，无法通过该类型的校验，勿用于需要 NaN 场景。

支持的描述属性有：

* max: 用于控制最大值
* min: 用于控制最小值
* step: 当操作某些交互元素时的数据增长单位值
* mode
  * modes: `'input' | 'slider' | 'split'`

```typescript zodui:configure-preview
// configure
z.object({
  max: z.number(),
  min: z.number(),
  step: z.number(),
  mode: z.union([
    z.literal('input'),
    z.literal('slider'),
    z.literal('split'),
  ]),
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

### BigInt

大整数类型，对应为 JavaScript 中的 [BigInt 对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt)。
如名字所示，该类型任何模式下的控制器应当不支持任何小数输入。

> 在输出时会将数据处理为 BigInt 对象！！！

🏗️ Building...

### Hex

十六进制数字，常用于表述颜色，类型会默认转化为 number 类型，只用于分类控制器与展示模式。

🏗️ Building...

## String

通用字符串类型，支持任何形式的字符串输入。

支持的描述属性有：

* max: 最大字符数，中文默认为一个长度，二参可以取消该模式将其计算为长度为二
* min: 最小字符数，中文默认为一个长度，二参可以取消该模式将其计算为长度为二
* mode
  * modes: `'textarea' | 'date' | 'datetime'`

```typescript zodui:configure-preview
// configure
z.object({
  max: z.number(),
  min: z.number(),
  mode: z.union([
    z.literal('textarea'),
    z.literal('date'),
    z.literal('datetime'),
  ]),
})
// preview
import * as z from 'zod'

export default z
  .string()
  .max(__CONFIGURE__.max)
  .min(__CONFIGURE__.min)
  .mode(__CONFIGURE__.mode)
```

## Boolean

通用布尔类型，支持真假控制输入。

支持的描述属性有：

* mode
  * modes: `'switch' | 'chekbox'`

```typescript zodui:configure-preview
// configure
z.object({
  mode: z.union([
    z.literal('switch'),
    z.literal('chekbox'),
  ]),
})
// preview
import * as z from 'zod'

export default z
  .boolean()
  .mode(__CONFIGURE__.mode)
```

## Date

通用日期类型。

支持的描述属性有：

* max: 最晚时间点，date、time 模式下只会读取对应范围的限制
* min: 最早时间点，date、time 模式下只会读取对应范围的限制
* mode
  * modes: `'date' | 'time' | 'datetime' | 'panel'`

```typescript zodui:configure-preview
// configure
z.object({
  max: z.date(),
  min: z.date(),
  mode: z.union([
    z.literal('date'),
    z.literal('time'),
    z.literal('datetime'),
    z.literal('panel'),
  ]),
})
// preview
import * as z from 'zod'

export default z
  .date()
  .max(__CONFIGURE__.max)
  .min(__CONFIGURE__.min)
  .mode(__CONFIGURE__.mode)
```
