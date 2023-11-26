# 运算类型

如果你对 TypeScript 有所了解，那么你应该知道 TypeScript 中的类型运算符，Zod 也支持了一些类型运算符，这些类型运算符可以帮助你更好的描述你的类型。

## 联合类型

在 TypeScript 中我们可以通过 `|`（联合） 运算符来实现的，同样的 Zod 也支持了这一种类型运算的定义方式，通过使用 `z.union` 便可以定义你需要的联合类型。

```typescript zodui:preview
[
  z
    .union([
      z.string().label('字符串'),
      z.number().label('数字')
    ])
    .label('字符串或数字')
    .describe(
      '联合基础类型的情况下，输入框首先将会渲染为一个下拉框，你可以通过单击下拉框来选择需要的类型。\n' +
      '下拉框的选项的文本由对应的类型的 label 属性决定，你可以通过 label 属性来修改对应的文本。\n' +
      '当你选择了对应的类型之后，输入框将会渲染为对应的类型的输入框，你可以通过交互来输入对应的内容。'
    ),
  z
    .union([
      z.literal('a').label('A'),
      z.literal('b').label('B'),
      z.literal(1).label('数字 1'),
      z.literal({
        type: '类型',
        name: '名称'
      }).label('一个对象')
    ])
    .label('A 或 B 或者其他的 literal（字面量） 类型')
    .describe(
      '联合 literal（字面量）类型的情况下，输入框首先将会渲染为一个下拉框，你可以通过单击下拉框来选择需要的类型。\n' +
      '下拉框的选项的文本由对应的类型的 label 属性决定，你可以通过 label 属性来修改对应的文本。'
    )
]
```

### 可供调整的交互模式

除了默认的 select 交互模式你还可以选择使用 radio 的方式来进行渲染，你可以通过 `z.union` 的 `mode` 方法来进行设置。

```typescript zodui:preview
[
  z
    .union([
      z.literal('a').label('A'),
      z.literal('b').label('B'),
      z.literal(1).label('数字 1'),
      z.literal({
        type: '类型',
        name: '名称'
      }).label('一个对象')
    ])
    .mode('radio')
    .label('A/B/C?')
    .describe(
      '联合 literal（字面量）类型的情况下，输入框首先将会渲染为一个单选框，你可以通过单击单选框来选择需要的类型。\n' +
      '单选框的选项的文本由对应的类型的 label 属性决定，你可以通过 label 属性来修改对应的文本。'
    ),
  z
    .union([
      z.literal('a').label('A'),
      z.literal('b').label('B'),
      z.literal(1).label('数字 1')
    ])
    .mode('radio direction-column')
    .label('A/B/C?')
    .describe('单选框的方向可以通过 `direction-column` 来进行设置。'),
  z
    .union([
      z.literal('a').label('A'),
      z.literal('b').label('B'),
      z.literal(1).label('数字 1')
    ])
    .mode('radio direction-column wrap')
    .label('A/B/C?')
    .describe('如果在右侧的空间不足以容纳所有的选项，可以通过 `wrap` 来设置切换到下一行。'),
  z
    .union([
      z.literal('a').label('A'),
      z.literal('b').label('B')
    ])
    .mode('radio-outline')
    .label('A/B')
    .describe('换个样子？'),
  z
    .union([
      z.literal('a').label('A'),
      z.literal('b').label('B')
    ])
    .mode('radio-card')
    .label('A/B/C?')
    .describe('还是说你喜欢这个？'),
]
```

### 插入在下方的选项

一般情况下我们会选择将选项直接放在右侧的操作区域内，但是有些场景下其实我们是没办法从右侧交互来进行操作的，这个时候我们可能会想到 `wrap` 的模式，但是这个的能力也不是无限的。\
但是在这里，我们通过提供了一个 `append` 的模式来解决这个问题，这个模式下，我们可以将选项插入到下方的操作区域内，这样我们就可以通过下方的操作区域来进行交互了。

```typescript zodui:preview
z
  .union([
    z.literal(false).label('不愿透露'),
    z.object({
      name: z.string().label('名称'),
      birthday: z
        .date()
        .mode('datetime panel wrap')
        .label('生日')
    }).label('填写信息'),
  ])
  .mode('append')
  .label('A/B/C?')
  .describe(
    '通过 `append` 模式，我们可以将选项插入到下方新的操作区域内，现在你可以选择右侧的`填写信息`选项试试看。'
  )
```

### 表单的联动

除此之外，如果你存在一些较为复杂的表单联动的需求，其实你也可以善用联合类型来实现这一类需求。

```typescript zodui:preview
z
  .discriminatedUnion([
    z.object({
      type: z.string(),
    }),
    z.object({
      type: z.literal('a').label('A'),
      name: z.string().label('名称')
    }),
    z.object({
      type: z.literal('b').label('B'),
      age: z.number().label('年龄')
    })
  ])
```

```typescript zodui:preview
z
  .union([
    z.object({
      type: z.string(),
    }),
    z.object({
      type: z.literal('a').label('A'),
      name: z.string().label('名称')
    }),
    z.object({
      type: z.literal('b').label('B'),
      age: z.number().label('年龄')
    })
  ])
```

## 交叉类型

在 TypeScript 中我们可以通过 `&`（交叉） 运算符来实现的，同样的 Zod 也支持了这一种类型运算的定义方式，通过使用 `z.intersection` 便可以定义你需要的交叉类型。

```typescript zodui:preview
z
  .intersection(
    z
      .object({
        name: z.string().label('名称'),
        age: z.number().label('年龄')
      })
      .label('基础信息'),
    z
      .object({
        location: z.string().label('位置'),
        address: z.string().label('地址')
      })
      .label('背景信息')
  )
  .label('名称与年龄')
  .describe('交叉类型的情况下，输入框将会渲染为两个输入框，你可以通过交互来输入对应的内容。')
```
