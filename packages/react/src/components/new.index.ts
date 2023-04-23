import { CSSProperties, ReactElement } from 'react'

declare module '@zodui/core' {
  export interface Frameworks {
    react: {}
  }
}

export type ZElement<T = undefined> = T extends undefined ? ReactElement : (props: T) => ReactElement;

export interface BaseProps {
  style?: CSSProperties
  className?: string
}
