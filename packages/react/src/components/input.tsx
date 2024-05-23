import type { Frameworks } from '@zodui/core'

import { useCoreContextComponent } from '../contexts'

export type Input = Frameworks['react']['Components']['Input']

export const Input: Input = (props) => {
  const Input = useCoreContextComponent('Input')
  if (Input)
    return <Input {...props} />

  const {
    onChange,
    value,
    defaultValue,
    ...rest
  } = props
  return <input
    value={value ?? defaultValue ?? ''}
    onChange={e => {
      const value = e.target.value
      type Value = Parameters<NonNullable<typeof onChange>>[0]
      if (props.type === 'number') {
        onChange?.(Number(value) as Value)
        return
      }
      onChange?.(value as Value)
    }}
    {...rest}
  />
}

export type InputAdornment = Frameworks['react']['Components']['InputAdornment']

export const InputAdornment: InputAdornment = (props) => {
  const InputAdornment = useCoreContextComponent('InputAdornment')
  if (InputAdornment)
    return <InputAdornment {...props} />

  const { prev, next, children, className, style } = props
  return <span
    className={'zodui-input-adornment' + (className ? ' ' + className : '')}
    style={style}
    >
    {prev}
    {children}
    {next}
  </span>
}
