import { useMemo } from 'react'
import { Frameworks } from '@zodui/core'
import { useCoreContextComponent } from '@zodui/react'

import { Icon, isInnerIcon } from './icon'

export type Button = Frameworks['react']['Components']['Button']

export const Button: Button = ({
  icon,
  ...props
}) => {
  props = Object.assign({
    shape: 'square',
    variant: 'outline',
  }, props)
  const wrapIcon = useMemo(() => typeof icon === 'string' && isInnerIcon(icon)
    ? <Icon name={icon} />
    : icon, [icon])

  const Button = useCoreContextComponent('Button')
  if (Button)
    return <Button icon={wrapIcon} {...props} />

  return <button {...props}>
    {props.children ? props.children : wrapIcon}
  </button>
}
