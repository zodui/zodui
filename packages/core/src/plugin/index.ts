import { Framework, FrameworksKeys } from './framework'

export * from './framework'
export type {
  FrameworkComponents
} from './components'

export interface Context {
  use(p: Plugin | (() => Promise<Plugin>)): this
  framework<K extends FrameworksKeys>(key: K): Framework<K>
}

export interface Plugin {
  name: string
  call: (ctx: Context) => void
}

export function definePlugin(
  name: Plugin['name'],
  call: Plugin['call']
): Plugin {
  return { name, call }
}
