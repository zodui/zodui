# 如何参与贡献

* 目前的反馈渠道为 GitHub Issues
* 同时你也可以参与到项目的维护中来

## 前置需求

* 对 Node.js 有一定了解
* 本仓库暂时只支持使用 `yarn` 进行开发，其他的 `pm` 未验证使用过
* 对 TypeScript 有一定了解
* 对 GitHub 的分支管理以及 Pull Request 流程具备一定的了解

## 基本情况

项目采取 monorepo 的形式进行维护，主体内容位于 packages

比如说如果你需要开发 react 的插件，那么他在 `packages/react` 下

同时有一个专门用于开发调试的包 `demo`，里面负责在线演示以及开发调试

暂时还未维护文档相关内容

## 开始开发

在开始开发之前，你需要先安装依赖

```bash
yarn
```

然后你需要先启动 demo，这样你就可以在 demo 中进行开发调试

```bash
# 假设你在开发 react，那么运行下面这段命令
yarn workspace @zodui/demo serve:react
```

在 `packages` 目录下的相应目录下进行开发，vite 会自动热载对应模块下的内容

## 完成开发

向我提供一个 PR 吧，我很乐意将合适的代码合入主分支，并对你的代码提供相关的建议
