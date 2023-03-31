import { ComponentType, CSSProperties, SVGAttributes } from 'react'


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
