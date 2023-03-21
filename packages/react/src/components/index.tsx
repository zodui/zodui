import React, { CSSProperties, SVGAttributes } from 'react'

const CONTROL_COMPS = {
  Button: () => <></>,

  Switch: () => <></>,

  Select: () => <></>,
  RadioGroup: () => <></>,

  Input: () => <></>,
  Textarea: () => <></>,
  InputNumber: () => <></>,
  InputAdornment: () => <></>,

  Code: () => <></>,

  Dialog: () => <></>,
  Drawer: () => <></>,

  Number: {
    Slider: () => <></>,
    Rate: () => <></>
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

const IconMap = new Map<Icons, React.ComponentType<IconComponentProps>>()

export function registerIcon(name: Icons, Comp: React.ComponentType<IconComponentProps>) {
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
