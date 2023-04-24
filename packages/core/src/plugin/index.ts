import { Framework, FrameworksKeys } from './framework'

export * from './framework'
export type {
  FrameworkComponents,
  ComponentProps
} from './components'

export class Context<
  PluginName extends string = string
> {
  use(p: Plugin | (() => Promise<Plugin>) | (() => Promise<{ default: Plugin }>)) {
    return this
  }
  framework<K extends FrameworksKeys>(key: K): Framework<K, PluginName> {
    return new Framework(this as Context<PluginName>)
  }
}

export interface Plugin<N extends string = string> {
  name: N
  call: (ctx: Context) => void
}

export function definePlugin(
  name: Plugin['name'],
  call: Plugin['call']
): Plugin {
  return { name, call }
}
