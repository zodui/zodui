import { ButtonHTMLAttributes, CSSProperties, InputHTMLAttributes, ReactElement } from 'react'

export type ZElement<T = undefined> = T extends undefined ? ReactElement : (props: T) => ReactElement;

export interface BaseProps {
  style?: CSSProperties
  className?: string
}

export namespace BaseCompProps {
  export type InputValue = string | number | undefined
  export type Input<T extends InputValue = string> = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | 'size'
    | 'type'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    // not need
    | 'onBlur'
    | 'onFocus'
    | 'onClick'
    | 'onPaste'
    | 'onWheel'
  > & BaseProps & {
    type?: 'text' | 'password' | 'number' | 'email' | 'tel' | 'url' | 'search'
    value?: T
    defaultValue?: T
    onChange?: (v: T) => void
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
  Input?: <T extends BaseCompProps.InputValue>(props: BaseCompProps.Input<T>) => ReactElement
  Button?: (props: BaseCompProps.Button) => ReactElement
} = {}

export function registerBaseComp<K extends keyof typeof BaseComps>(name: K, comp: (typeof BaseComps)[K]) {
  BaseComps[name] = comp
}

export { Input } from './input'
export { Button } from './button'
