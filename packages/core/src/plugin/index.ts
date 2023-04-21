import { Framework, FrameworksKeys } from './framework'

export * from './framework'
export type {
  FrameworkComponents
} from './components'

export interface Context {
  framework<K extends FrameworksKeys>(key: K): Framework<K>
}

export interface Plugin {
  name: string
  call: (ctx: Context) => void
}
