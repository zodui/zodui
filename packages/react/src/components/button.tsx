import type { Frameworks, Icons } from '@zodui/core'
import { useMemo } from 'react'

import { useCoreContextComponent } from '../contexts'
import { Icon } from './icon'

type InnerButton = Frameworks['react']['Components']['Button']

type InnerButtonProps = Parameters<InnerButton>[0]

export type Button = (props:
  & Omit<InnerButtonProps, 'icon'>
  & {
    icon: InnerButtonProps['icon'] | Icons | (string & {})
  }) => ReturnType<InnerButton>

export const Button: Button = ({
  icon,
  ...props
}) => {
  props = Object.assign({
    shape: 'square',
    variant: 'outline'
  }, props)
  const wrapIcon = useMemo(() => typeof icon === 'string'
    ? <Icon name={icon} />
    : icon, [icon])

  const Button = useCoreContextComponent('Button')
  if (Button)
    return <Button icon={wrapIcon} {...props} />

  return <button {...props}>
    {props.children ? props.children : wrapIcon}
  </button>
}
