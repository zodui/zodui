import {
  ButtonHTMLAttributes, createContext,
  CSSProperties,
  InputHTMLAttributes,
  PropsWithChildren,
  ReactElement,
  SelectHTMLAttributes, useContext, useEffect, useState
} from 'react'
import { ComponentProps, Context, Context as InnerCoreContext } from '@zodui/core'

declare module '@zodui/core' {
  export interface Frameworks {
    react: ReactFramework
  }
}

export type ZElement<T = undefined> = T extends undefined ? ReactElement : (props: T) => ReactElement;

export interface BaseProps {
  style?: CSSProperties
  className?: string
}

export namespace InnerProps {
  export type Input<T extends ComponentProps.InputValue = string> =
    & BaseProps
    & Omit<InputHTMLAttributes<HTMLInputElement>,
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
    | 'onWheel'>
    & ComponentProps.Input
  export type InputAdornment =
    & BaseProps
    & PropsWithChildren
    & ComponentProps.InputAdornment
    & {
      prev?: ZElement
      next?: ZElement
    }
  export type Button =
    & BaseProps
    & ButtonHTMLAttributes<HTMLButtonElement>
    & ComponentProps.Button
    & {
      icon?: ZElement
    }
  // TODO support input select
  // TODO support multiple select
  export type Select<T extends ComponentProps.SelectValue> =
    & BaseProps
    & Omit<SelectHTMLAttributes<HTMLSelectElement>,
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
    | 'onWheel'>
    & ComponentProps.Select<T>
  export type Switch =
    & BaseProps
    & ComponentProps.Switch
  export type DropdownMenuItem =
    & {
      icon?: string | ReactElement
      label: string | ReactElement
    }
    & ComponentProps.DropdownMenuItem
  export type Dropdown =
    & BaseProps
    & ComponentProps.Dropdown
    & {
      menu: DropdownMenuItem[]
      children?: ReactElement
      onAction?: (value: string | number, item: DropdownMenuItem) => void
    }
  // RadioGroup: () => <></>
  // Dialog: () => <></>
  // Drawer: () => <></>
}

interface ReactFramework {
  Components: {
    Input: <T extends ComponentProps.InputValue>(props: InnerProps.Input<T>) => ReactElement
    InputAdornment: (props: InnerProps.InputAdornment) => ReactElement
    Button: (props: InnerProps.Button) => ReactElement
    Select: <T extends ComponentProps.SelectValue>(props: InnerProps.Select<T>) => ReactElement
    Switch: (props: InnerProps.Switch) => ReactElement
    Dropdown: (props: InnerProps.Dropdown) => ReactElement
  }
}

const CoreContext = createContext<InnerCoreContext>(null)

export const CoreContextProvider = (props: PropsWithChildren) => {
  const ctx = useContext(CoreContext) ?? Context.global
  useEffect(() => {
  }, [])
  return <CoreContext.Provider value={ctx}>
    {props.children}
  </CoreContext.Provider>
}

export const useCoreContextField = <T extends any>(k: string) => {
  const ctx = useContext(CoreContext) ?? Context.global
  const [InnerTarget, onTargetChange] = ctx.get<T>(k)
  const [Target, setTarget] = useState<T>(InnerTarget)
  useEffect(() => {
    return onTargetChange((newTarget: T) => setTarget(newTarget))
  })
  return Target
}

export type Input = ReactFramework['Components']['Input']

export const Input: Input = (props) => {
  const Input = useCoreContextField<Input>('Input')
  if (Input)
    return <Input {...props} />

  const { onChange, ...rest } = props
  return <input
    onChange={e => {
      switch (typeof props.value) {
        case 'string':
          onChange?.(e.target.value)
          break
        case 'number':
          onChange?.(Number(e.target.value))
          break
        default:
          onChange?.(String(e.target.value))
      }
    }}
    {...rest}
  />
}
