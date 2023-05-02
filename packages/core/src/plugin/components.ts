import { FrameworksKeys } from './framework'

export type Icons =
  | 'Add'
  | 'More'
  | 'Link'
  | 'Clear'
  | 'Delete'
  | 'Append'
  | 'Prepend'
  | 'ArrowUp'
  | 'ArrowDown'

export interface FrameworkComponents {
  [key: string]: {
    [K in FrameworksKeys]: any
  }
}

export namespace ComponentProps {
  export type InputValue = string | number | undefined
  export type Input<T extends InputValue = InputValue> =
    & {
      type?: 'text' | 'password' | 'number' | 'email' | 'tel' | 'url' | 'search'
      value?: T
      defaultValue?: T
      onChange?: (v: T) => void
    }
    & ({
      mode?: string
    } | {
      type?: 'number'
      mode?: 'split'
    })
  export type InputAdornment = {
    prev?: any
    next?: any
  }
  export type Button = {
    icon?: any
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
  export type Select<T extends SelectValue> = {
    options?: SelectOptions[]
    value?: T
    defaultValue?: T
    onChange?: (v: T) => void
  }
  export type Switch = {
    value?: boolean
    defaultValue?: boolean
    onChange?: (v: boolean) => void
  }
  export type DropdownMenuItem = {
    icon?: any
    label: any
    title?: string
    value?: string | number
    disabled?: boolean
  }
  export type Dropdown = {
    trigger?: 'hover' | 'click'
    placement?: 'right'
    menu: DropdownMenuItem[]
    children?: any
    onAction?: (value: string | number, item: DropdownMenuItem) => void
  }
  // RadioGroup: () => <></>
  // Dialog: () => <></>
  // Drawer: () => <></>
}
