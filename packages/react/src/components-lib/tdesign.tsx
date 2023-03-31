import './tdesign.scss'
import 'tdesign-react/esm/style/index.js'
import {
  AddIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ClearIcon,
  DeleteIcon,
  LinkIcon,
  MoreIcon,
  RollbackIcon
} from 'tdesign-icons-react'
import { Button, Slider, Select, Input, InputNumber, Textarea } from 'tdesign-react/esm'

import { registerController, registerIcon } from '../components'
import { registerBaseComp } from '../components/base'
import { Narrow } from '../utils'

initIcons: {
  registerIcon('Add', AddIcon)
  registerIcon('More', MoreIcon)
  registerIcon('Link', LinkIcon)
  registerIcon('Clear', ClearIcon)
  registerIcon('Delete', DeleteIcon)
  registerIcon('Prepend', props => <RollbackIcon style={{
    transform: 'rotate(90deg)'
  }} />)
  registerIcon('Append', props => <RollbackIcon style={{
    transform: 'rotate(-90deg)'
  }} />)
  registerIcon('ArrowUp', ArrowUpIcon)
  registerIcon('ArrowDown', ArrowDownIcon)
}

initComponents: {
  function isTargetType<T, Types extends T>(t: T | Types, types: Narrow<Types[]>): t is Types {
    return types.includes(
      // @ts-ignore
      t
    )
  }
  registerBaseComp('Input', ({
    type,
    mode,
    value,
    defaultValue,
    onChange,
    ...props
  }) => {
    if (isTargetType(type, ['email', 'tel', 'url', 'search'])) {
      return <>Not support type {type}</>
    }
    if (type === 'number' && mode === 'split') {
      const parseNumberValue = (t: any) => t !== undefined ? +t : undefined
      // TODO resolve NAN, Infinity, -Infinity
      return <InputNumber
        value={parseNumberValue(value)}
        defaultValue={parseNumberValue(defaultValue)}
        onChange={onChange as any}
      />
    }
    return <Input
      type={type}
      value={value as any}
      defaultValue={defaultValue as any}
      onChange={onChange as any}
      {...props}
    />
  })
  registerBaseComp('Button', ({ theme, ...props }) => <Button
    theme={({
      info: 'default',
      error: 'danger',
      warning: 'warning',
      success: 'success',
    } as const)[theme]}
    {...props}
  />)
  registerBaseComp('Select', ({ ...props }) => <Select
    {...props}
    value={props.value}
    onChange={v => props.onChange?.(v as any)}
  />)

  registerController('Number.Slider', props => <Slider {...props} />)
  registerController('String.TextArea', props => <Textarea
    autosize={{
      minRows: 1,
    }}
    {...props}
  />)
}
