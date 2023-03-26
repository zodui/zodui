import { ButtonHTMLAttributes, CSSProperties, ReactElement } from 'react'

export type ZElement<T = undefined> = T extends undefined ? ReactElement : (props: T) => ReactElement;

export interface BaseProps {
  style?: CSSProperties
  className?: string
}

export namespace BaseCompProps {
  export type Input = BaseProps & {
    value?: string
    onChange?: (v: string) => void
  }
  export type Button = ButtonHTMLAttributes<HTMLButtonElement> & BaseProps & {
    icon?: ZElement
    theme?: 'error' | 'warning' | 'success' | 'info'
    shape?: 'square' | 'round' | 'circle'
    variant?: 'text' | 'outline'
    onClick?: () => void
  }
  // Switch: () => <></>
  // Select: () => <></>
  // RadioGroup: () => <></>
  // Dialog: () => <></>
  // Drawer: () => <></>
}

export const BaseComps: {
  Input?: (props: BaseCompProps.Input) => ReactElement
  Button?: (props: BaseCompProps.Button) => ReactElement
} = {}

export function registerBaseComp<K extends keyof typeof BaseComps>(name: K, comp: (typeof BaseComps)[K]) {
  BaseComps[name] = comp
}

export { Button } from './button'
