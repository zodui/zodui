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

export type IconComponentProps<T extends Record<string, any>> =
  & T
  & {
    size?: 'small' | 'medium' | 'large' | string | number;
  }

export interface FrameworkComponents {
  [key: string]: {
    [K in FrameworksKeys]: any
  }
}
