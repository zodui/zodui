import {
  ButtonHTMLAttributes,
  ComponentType,
  CSSProperties,
  ReactElement,
  SVGAttributes,
  useMemo
} from 'react'
import { useErrorHandlerContext } from '../error-handler'

type Element<T = undefined> = T extends undefined ? ReactElement : (props: T) => ReactElement;

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
    icon?: Element
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

const BaseComps: {
  Input?: (props: BaseCompProps.Input) => ReactElement
  Button?: (props: BaseCompProps.Button) => ReactElement
} = {}

export function registerBaseComp<K extends keyof typeof BaseComps>(name: K, comp: (typeof BaseComps)[K]) {
  BaseComps[name] = comp
}

export function Button({
  icon,
  ...props
}: Omit<BaseCompProps.Button, 'icon'> & {
  icon?: Icons | Element
}) {
  const wrapIcon = useMemo(() => typeof icon === 'string' && isInnerIcon(icon)
    ? <Icon name={icon} />
    : icon, [icon])
  if (BaseComps.Button) {
    return <BaseComps.Button
      icon={wrapIcon}
      {...props}
    />
  }
  return <button {...props}>
    {props.children ? props.children : wrapIcon}
  </button>
}

type CompsTree = {
  [k: string]: ((props: any) => ReactElement) | CompsTree
}

const CONTROL_COMPS: CompsTree = {
  Number: {
    Rate: () => <></>,
    Input: () => <></>
  },
  Datetime: {
    DatePicker: () => <></>,
    DateRangePicker: () => <></>,
    TimeRangePicker: () => <></>,
    DatePickerPanel: () => <></>,
    TimePickerPanel: () => <></>
  },
  Color: {
    ColorPicker: () => <></>,
    ColorPickerPanel: () => <></>
  },
  Array: {
    CheckBoxGroup: () => <></>,
    SelectMultiple: () => <></>
  },
}

export function registerController(path: string, Controller: (props: any) => ReactElement) {
  const pathArr = path.split('.')
  let target = CONTROL_COMPS
  for (let i = 0; i < pathArr.length; i++) {
    const key = pathArr[i]
    if (i === pathArr.length - 1) {
      target[key] = Controller
    } else {
      if (typeof target[key] === 'undefined') {
        target[key] = {}
      }
      target = target[key] as any
    }
  }
}

export function ControllerRender({
  target,
  ...props
}: {
  target: string
} & Record<string, any>) {
  const errorHandler = useErrorHandlerContext()
  const path = target.split('.')
  let TargetComp = CONTROL_COMPS
  for (let i = 0; i < path.length; i++) {
    const key = path[i]
    TargetComp = TargetComp[key] as any
  }
  if (!TargetComp) {
    return errorHandler.throwError(`Controller ${target} not found`)
  }
  if (typeof TargetComp !== 'function') {
    return errorHandler.throwError(`Controller ${target} is not a function`)
  }
  // TODO remove ignore? or maintain the status
  // @ts-ignore
  return <TargetComp {...props}/>
}

interface IconComponentProps extends SVGAttributes<SVGSVGElement> {
  style?: CSSProperties;
  className?: string;
  size?: 'small' | 'medium' | 'large' | string | number;
}

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

const IconMap = new Map<Icons, ComponentType<IconComponentProps>>()

export function isInnerIcon(name: Icons | string): name is Icons {
  return IconMap.has(name as Icons)
}

export function registerIcon(name: Icons, Comp: ComponentType<IconComponentProps>) {
  IconMap.set(name, Comp)
}

export function Icon(props: IconComponentProps & { name: Icons }) {
  const { name, ...rest } = props
  const Comp = IconMap.get(name)
  if (!Comp) {
    console.warn(`Icon ${name} not found`)
    return null
  }
  return <Comp {...rest} />
}
