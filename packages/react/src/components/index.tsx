import {
  ComponentType,
  CSSProperties,
  SVGAttributes,
  ReactElement
} from 'react'
import { useErrorHandlerContext } from '../error-handler'

export {
  Input,
  Button,
} from './base'

type CompsTree = {
  [k: string]: ((props: any) => ReactElement) | CompsTree
}

const CONTROL_COMPS: CompsTree = {
  // TODO Custom type props when use ControllerRender to render component
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
