import type { Context, Icons } from '@zodui/core'

export class Framework<
  K extends FrameworksKeys,
  N extends string = string,
  Components = Frameworks[K]['Components'],
> {
  constructor(
    private readonly key: K,
    private readonly ctx: Context<N>
  ) {
  }
  defineComp<
    Type extends keyof Components & string,
  >(
    type: Type, Component: Components[Type]
  ) {
    this.ctx.set(`framework.${this.key}.components.${type}`, Component)
    return this
  }
  defineIcon<
    Icon extends Icons
  >(
    icon: Icon,
    Comp: Frameworks[K]['Icon']
  ) {
    this.ctx.set(`framework.${this.key}.icons.${icon}`, Comp)
    return this
  }
  // defineCtrl(): Framework<K>
  // defineView(): Framework<K>
  // defineStructure(): Framework<K>
}

export interface Frameworks {
  [key: string]: {
    Icon: any
    /**
     * define framework special component func value to infer defineComp func type
     */
    Components: Record<string, any>
  }
}

export type FrameworksKeys = keyof Frameworks & string
