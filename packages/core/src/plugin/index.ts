import { Framework, FrameworksKeys } from './framework'

export * from './framework'
export type {
  Icons,
  FrameworkComponents,
  ComponentProps
} from './components'

const effectSymbol = Symbol('effect')

class Emitter {
  #listeners = new Map<string, Function[]>()
  on(key: string, func: Function) {
    const list = this.#listeners.get(key) || []
    let index = list.length
    list.push(func)
    this.#listeners.set(key, list)
    return () => {
      list.splice(index, 1)
      this.#listeners.set(key, list)
    }
  }
  do(...args: any[]) {
    const [key, ...params] = args
    const list = this.#listeners.get(key) || []
    list.forEach(func => func(...params))
  }
}

/**
 * Contexts extended by the same Context share the same store
 * The `extend` method is used to record the side effects of the next operation
 * When you need to reclaim the side effects of this segment, you only need to call the off function,
 * or execute the functions from `[effectSymbol]` filed
 */
export class Context<
  PluginName extends string = string
> {
  static global = new Context()
  ;[effectSymbol]: Function[] = []
  constructor(
    private readonly store = new Map<string, any>(),
    private readonly emitter = new Emitter()
  ) {
  }
  extend() {
    return new Context(this.store, this.emitter)
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
      this.emitter.on.bind(this.emitter, k),
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

    // make effect function closure for store this reference
    const wrapEffect = () => effect()
    this[effectSymbol].push(wrapEffect)
    return wrapEffect
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
