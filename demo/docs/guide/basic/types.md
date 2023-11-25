# 类型

Zod 支持了许多不同的类型，这些类型可以用来描述数据的基础类型，也可以用来描述自定义类型，ZodUI 则基于这套类型描述系统上通过对应的类型规则选择合适的组件渲染。\
所以在这里我们需要认知到，我们有哪些类型可以用，如果你对 JavaScript 的常见类型有所了解，那么你可以很快的上手 Zod 的类型系统的前半部分。\
如果你对 TypeScript 的类型系统有所了解，那么你可以很快的上手 Zod 的类型系统的后半部分（大概前半部分也是没有问题的），因为 Zod 的类型系统是基于 TypeScript 的类型系统的，所以你可以很快的上手。

## 原始值类型

首先我们认识到我们的底座是在 JavaScript 之上的，所以你需要对 JavaScript 的基础类型有一定的了解，你可以参考阅读 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures)。\
在 Zod 中支持了许多[*原始值类型（Primitive）*](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#%E5%8E%9F%E5%A7%8B%E5%80%BC)，你可以通过 `z.<type>` 来获取声明对应的类型校验。并通过传入给 ZodUI 组件时渲染为你需要的视图。\
接下来我们来看看 Zod 支持了哪些原始值类型。

### 字符串

字符串类型，对应 JavaScript 中的 [`string`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String) 类型。

```typescript zodui:preview
[
  z
    .string()
    .label('文本'),
  z
    .string()
    .mode('secret')
    .label('密文')
    .describe('密文模式下，输入框将会隐藏输入内容，你可以通过单击眼睛图标来切换查看模式。'),
  z
    .string()
    .mode('link')
    .label('链接')
    .describe('链接模式下，输入框将会渲染为链接，你可以通过单击输入框右侧的链接按钮来跳转到对应的输入内容所在的地址。'),
  z
    .string()
    .mode('wrap textarea')
    .label('多行文本')
    .describe('多行文本模式下，输入框将会渲染为多行文本框，你可以通过输入换行增加输入框的高度。'),
  // z
  //   .string()
  //   .mode('wrap code-monaco::json')
]
```

### 数字

数字类型，对应 JavaScript 中的 [`number`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number) 类型。

```typescript zodui:preview
[
  z
    .number()
    .label('数字'),
  z
    .number()
    .mode('split')
    .label('分割')
    .describe('分割模式下，输入框将会渲染为一个输入框与左右两个按钮，你可以通过点击按钮来增加或减少输入框的值。'),
  z
    .number()
    .mode('slider')
    .label('滑块')
    .describe('滑块模式下，输入框将会渲染为一个滑块，你可以通过拖动滑块来增加或减少输入框的值。'),
]
```

### 布尔

布尔类型，对应 JavaScript 中的 [`boolean`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Boolean) 类型。

```typescript zodui:preview
z.boolean()
```

### 日期

日期类型，对应 JavaScript 中的 [`Date`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date) 类型。\
对于日期类型，除了下面的之外，比较常见还有选择时间范围的一种类型，你可以在[组合类型/元组](#元组)中看到这种交互模式应该如何被定义。

```typescript zodui:preview
[
  z.date().label('日期（但是手输）'),
  z.date().mode('date').label('日期'),
  z.date().mode('datetime').label('日期时间'),
  z.date().mode('time').label('时间'),
  z.date().mode('date panel wrap').label('日期')
    .describe('日期模式并且叠加了表盘的情况下，交互区域将会以无须下拉的表盘的形式展示。'),
  z.date().mode('datetime panel wrap').label('日期时间')
    .describe('日期时间模式并且叠加了表盘的情况下，交互区域将会以无须下拉的表盘的形式展示。'),
  z.date().mode('time panel wrap').label('日期时间')
    .describe('时间模式并且叠加了表盘的情况下，交互区域将会以无须下拉的表盘的形式展示。'),
]
```

### 字符

## 组合类型

### 对象

### 字典

### 图（Map）

### 数组

### 元组

### 集合（Set）

## 特殊类型

### 空类型

### 任意类型

### 不存在的类型

## 运算类型

### 联合类型

### 交叉类型
