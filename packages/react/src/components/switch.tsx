import type { Frameworks } from '@zodui/core'
import { useCallback, useEffect, useState } from 'react'

import { useCoreContextComponent } from '../contexts'

export type Switch = Frameworks['react']['Components']['Switch']

const OriginalSwitch: Switch = props => {
  const {
    value,
    defaultValue,
    onChange,
    ...rest
  } = props
  const [checked, setChecked] = useState<boolean>(value ?? defaultValue)
  useEffect(() => {
    setChecked(value ?? defaultValue)
  }, [value, defaultValue])
  const checkedChange = useCallback((checked: boolean) => {
    setChecked(checked)
    onChange?.(checked)
  }, [onChange])
  // TODO resolve react warning
  //      A component is changing an uncontrolled input to be controlled.
  //      This is likely caused by the value changing from undefined to a defined value, which should not happen.
  //      Decide between using a controlled or uncontrolled input element for the lifetime of the component.
  //      More info: https://reactjs.org/link/controlled-components
  return <input
    {...rest}
    type='checkbox'
    checked={checked}
    onChange={e => checkedChange(e.target.checked)}
  />
}

export const Switch: Switch = (props) => {
  const Switch = useCoreContextComponent('Switch')
  if (Switch)
    return <Switch {...props} />
  return <OriginalSwitch {...props} />
}
