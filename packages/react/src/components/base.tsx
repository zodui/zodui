import { ButtonHTMLAttributes, CSSProperties, InputHTMLAttributes, ReactElement, SelectHTMLAttributes } from 'react'

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
  } & ({
    mode?: string
  } | {
    type?: 'number'
    mode?: 'split'
  })
  export type Button = ButtonHTMLAttributes<HTMLButtonElement> & BaseProps & {
    icon?: ZElement
    theme?: 'error' | 'warning' | 'success' | 'info'
    shape?: 'square' | 'round' | 'circle'
    variant?: 'text' | 'outline'
    onClick?: () => void
  }
  export type SelectValue = string | number | undefined | (string | number)[]
  export type SelectOptions = {
    label: string
    title: string
    value: number
  }
  // TODO support input select
  // TODO support multiple select
  export type Select<T extends SelectValue> = Omit<
    SelectHTMLAttributes<HTMLSelectElement>,
    | 'size'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    // not need
    | 'onBlur'
    | 'onMouseEnter'
    | 'onMouseLeave'
    | 'onFocus'
    | 'onClick'
    | 'onPaste'
    | 'onWheel'
  > & BaseProps & {
    options?: SelectOptions[]
    value?: T
    defaultValue?: T
    onChange?: (v: T) => void
  }
  // Switch: () => <></>
  // RadioGroup: () => <></>
  // Dialog: () => <></>
  // Drawer: () => <></>
}

export const BaseComps: {
  Input?: <T extends BaseCompProps.InputValue>(props: BaseCompProps.Input<T>) => ReactElement
  Button?: (props: BaseCompProps.Button) => ReactElement
  Select?: <T extends BaseCompProps.SelectValue>(props: BaseCompProps.Select<T>) => ReactElement
} = {}

export function registerBaseComp<K extends keyof typeof BaseComps>(name: K, comp: (typeof BaseComps)[K]) {
  BaseComps[name] = comp
}

export { Input } from './input'
export { Button } from './button'
export { Select } from './select'
