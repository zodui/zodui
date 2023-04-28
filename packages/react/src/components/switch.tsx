import { useCallback, useEffect, useState } from 'react'
import { BaseCompProps, BaseComps } from './base'

export function Switch({
  value,
  defaultValue,
  onChange,
  ...props
}: BaseCompProps.Switch & {
}) {
  props = Object.assign({
  }, props)
  if (BaseComps.Switch) {
    return <BaseComps.Switch
      {...props}
      {...{ value, defaultValue, onChange }}
    />
  }
  const [checked, setChecked] = useState<boolean>(value ?? defaultValue)
  useEffect(() => {
    setChecked(value ?? defaultValue)
  }, [value ?? defaultValue])
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
    {...props}
    type='checkbox'
    checked={checked}
    onChange={e => checkedChange(e.target.checked)}
  />
}
