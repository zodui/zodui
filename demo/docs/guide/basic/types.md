# 类型

Zod 支持了许多不同的类型，这些类型可以用来描述数据的基础类型，也可以用来描述自定义类型。

## 基础类型

首先我们认识到我们的底座是在 JavaScript 之上的，所以你需要对 JavaScript 的基础类型有一定的了解，你可以参考阅读 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures)。\
在 Zod 中支持了许多 _原始值类型（Primitive）_，你可以通过 `z.<type>` 来获取声明对应的类型校验。并通过传入给 ZodUI 组件时渲染为你需要的视图。

### string

字符串类型，对应 JavaScript 中的 `string` 类型。

```typescript zodui:preview
z.string()
```
