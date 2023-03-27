import { useMemo } from 'react'
import { Icon, Icons, isInnerIcon } from './index'
import { BaseCompProps, BaseComps, ZElement } from './base'

export function Button({
  icon,
  ...props
}: Omit<BaseCompProps.Button, 'icon'> & {
  icon?: Icons | ZElement
}) {
  props = Object.assign({
    shape: 'square',
    variant: 'outline',
  }, props)
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
