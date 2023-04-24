import { Framework, FrameworksKeys } from './framework'

export * from './framework'
export type {
  FrameworkComponents,
  ComponentProps
} from './components'

export class Context<
  PluginName extends string = string
> {
  static global = new Context()
  constructor(
    private readonly store?: Map<string, any>
  ) {
    if (!store) {
      this.store = new Map()
    }
  }
  extend() {
    return new Context(this.store)
  }
  emitter = {
    listeners: new Map<string, Function[]>(),
    on: (key: string, func: Function) => {
      const list = this.emitter.listeners.get(key) || []
      list.push(func)
      this.emitter.listeners.set(key, list)
    },
    do: (...args: any[]) => {
      const [key, ...params] = args
      const list = this.emitter.listeners.get(key) || []
      list.forEach(func => func(...params))
    },
  }
  set(k: string, v?: any) {
    this.store!.set(k, v)
    this.emitter.do(k, v)
    return this
  }
  get<T>(k: string) {
    return [
      this.store!.get(k) as T,
      this.emitter.on.bind(this, k),
    ] as const
  }
  use(p: Plugin | (() => Promise<Plugin>) | (() => Promise<{ default: Plugin }>)) {
    if (typeof p === 'function') {
    } else {
    }
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
