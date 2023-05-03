import type { Frameworks } from '@zodui/core'
import { useCoreContextComponent } from '@zodui/react'

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
      if (props.type === 'number') {
        onChange?.(Number(e.target.value))
        return
      }
      switch (typeof value) {
        case 'string':
          onChange?.(e.target.value)
          break
        case 'number':
          onChange?.(Number(e.target.value))
          break
        default:
          onChange?.(String(e.target.value))
      }
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
