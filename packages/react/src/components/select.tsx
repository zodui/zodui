import { BaseCompProps, BaseComps } from './base'

export function Select<T extends BaseCompProps.SelectValue>({
  ...props
}: BaseCompProps.Select<T> & {
}) {
  props = Object.assign({
  }, props)
  if (BaseComps.Select) {
    return <BaseComps.Select
      {...props}
    />
  }
  const { onChange, ...rest } = props
  // @ts-ignore FIXME
  return <select
    {...rest}
    onChange={e => onChange(e.target.options.selectedIndex as T)}
  >
    {props.options.map((opt) => <option
      key={opt.value}
      value={opt.value}
      title={opt.title}>
      {opt.label}
    </option>)}
  </select>
}
