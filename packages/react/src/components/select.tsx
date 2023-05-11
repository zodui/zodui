import type { Frameworks } from '@zodui/core'

import { useCoreContextComponent } from '../contexts'

export type Select = Frameworks['react']['Components']['Select']

export const Select: Select = (props) => {
  const Select = useCoreContextComponent('Select')
  if (Select)
    return <Select {...props} />

  props = Object.assign({
  }, props)

  const { onChange, ...rest } = props
  // @ts-ignore FIXME
  return <select
    {...rest}
    // unable get generic T to let onChange work, so we use any to bypass it
    onChange={e => onChange(e.target.options.selectedIndex as any)}
    >
    {props.options.map((opt) => <option
      key={opt.value}
      value={opt.value}
      title={opt.title}>
      {opt.label}
    </option>)}
  </select>
}
