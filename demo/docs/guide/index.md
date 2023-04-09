# Guide

本项目旨在通过简单并且类型安全的通用描述生成需要的 UI，所以在这里我们引入了 Zod 作为我们的描述基础。

如果你对 TypeScript 的类型有一定的了解，那么你无需担心你对 Zod 的了解，写 Zod 就像是在写 interface 一样自然而又简单。
当然你如果并不熟悉 TypeScript 的类型系统，那么何不趁此通过 Zod 对他进行一番了解呢？你会喜欢上类型安全的并且享受其中的乐趣。

我们基于该框架，我们对 Zod 进行了扩充定义，详情可参考 [Zod External]()。在此基础上，你可以通过定义 zod 描述来生成你需要的 UI。
并且我们提供了一些[常用的 UI 组件]()，你可以通过[组合这些组件]()来生成你需要的 UI。
如果你在项目中可能涉及到特殊的 UI 控件以及展示形式，那么你可以通过[自定义插件]()的方式来实现。

## Let's begin

```typescript
z.object({
  name: z
    .string()
    .label('name')
    .describe('This is a name'),
  age: z
    .number()
    .label('age')
    .describe('Please input your age')
})
```
