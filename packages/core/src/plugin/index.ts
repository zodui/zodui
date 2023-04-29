import { Framework, FrameworksKeys } from './framework'

export * from './framework'
export type {
  FrameworkComponents,
  ComponentProps
} from './components'

const effectSymbol = Symbol('effect')

export class Context<
  PluginName extends string = string
> {
  static global = new Context()
  ;[effectSymbol]: Function[] = []
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
      let index = list.length
      list.push(func)
      this.emitter.listeners.set(key, list)
      return () => {
        list.splice(index, 1)
        this.emitter.listeners.set(key, list)
      }
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
    this[effectSymbol].push(() => {
      let storeV = this.store!.get(k)
      if (storeV === v) {
        this.store!.delete(k)
      }
    })
    return this
  }
  del(k: string) {
    const storeV = this.store!.get(k)
    this.store!.delete(k)
    this.emitter.do(k)
    this[effectSymbol].push(() => {
      this.store!.set(k, storeV)
    })
    return this
  }
  get<T>(k: string) {
    return [
      this.store!.get(k) as T,
      this.emitter.on.bind(this, k),
    ] as const
  }
  use(p: Plugin | (() => Promise<Plugin>) | (() => Promise<{ default: Plugin }>)) {
    let effect = () => {}

    const childCtx = this.extend()
    function collectPluginEffect(p: Plugin) {
      p.call(childCtx)
      effect = () => {
        childCtx[effectSymbol].forEach(func => func())
      }
    }
    if (typeof p === 'function') {
      const promise = p()
      if (promise instanceof Promise) {
        let isCancel = false
        promise
          .then(plugin => {
            if (isCancel) return
            // let default field prioritize
            if (plugin.default) {
              plugin = plugin.default
            }
            collectPluginEffect(plugin)
          })
        effect = () => {
          isCancel = true
        }
      } else {
        throw new Error('plugin must be a function or a promise')
      }
    } else {
      collectPluginEffect(p)
    }
    return effect
  }
  framework<K extends FrameworksKeys>(key: K): Framework<K, PluginName> {
    return new Framework(key, this)
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
