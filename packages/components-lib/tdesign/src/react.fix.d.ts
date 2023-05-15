import type { StyledProps } from '@zodui/react'
import type {} from 'tdesign-react/esm'

declare module 'tdesign-react/esm' {
  import type { JSXElementConstructor, ReactElement, Ref } from 'react'
  import type { SliderValue, TdSliderProps } from 'tdesign-react/esm'
  interface SliderProps<T extends SliderValue> extends TdSliderProps {
    value?: T
    defaultValue?: T
    onChange?: (value: T) => void | Promise<void>
  }
  export declare const Slider: <T extends SliderValue = SliderValue>(props: SliderProps<T> & StyledProps & {
    ref?: Ref<HTMLDivElement>
  }) => ReactElement<any, string | JSXElementConstructor<any>>
}
