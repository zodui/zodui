<p align="center">
  <a href="https://zodui.github.com/zodui" target="_blank" rel="noopener noreferrer">
    <img width="252" src="./demo/public/favicon.svg" alt="ZodUI logo">
  </a>
</p>

# ZodUI 💎

用更简洁的方式去组织你的表单乃至 UI ，使用 Zod 来确保提交数据的正确，减少你去书写 rules 的时间，通过 Zod 定义 DSL 语法使用更少的代码去书写更加通用的规则。

* 📃 极度的 UI 自定义，极强的拓展性，任意的组合任意的显示
* ▶️ 灵活可配置的控制你的显示
* 💎 通过 Zod 驱动的数据模型，并且针对各种类型的边界情况提供了特殊的交互逻辑
* 🏗️ 支持多种前端框架，并且尽可能使你开发的插件在多个框架中通用

```tsx
import zodui from 'zodui'

import { List } from '@zodui/react'

import '@zodui/react'
// or
import react from '@zodui/react'
useEffect(() => {
  return zodui.global.use(react)
}, [])

import TDesignComponentsLib, { Common, Senior } from '@zodui/components-lib-tdesign'

// Register global component
zodui.global.use(Common)

function Foo() {
  return <List
    model={zodui.object({
      foo: zodui.string(),
    })}
  />
}

function Bar() {
  // Register local component
  zodui.use(Senior)
  return <List
    model={zodui.object({
      foo: zodui.string(),
    })}
  />
}
```
