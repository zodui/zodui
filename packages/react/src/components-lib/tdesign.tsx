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
import {
  Button,
  Slider,
  Select,
  Switch,
  Dropdown,
  Input,
  InputAdornment,
  InputNumber,
  Textarea,
  TimePickerPanel, TimePicker, DatePickerPanel, DateRangePickerPanel, DatePicker, TimeRangePicker, DateRangePicker
} from 'tdesign-react/esm'

import { registerIcon, registerBaseComp, Icon } from '../components'
import { Narrow } from '../utils'
import { addController } from '../controllers'
import React from 'react'

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
      onChange={v => onChange?.(type === 'number' ? +v : v as any)}
      {...props}
    />
  })
  registerBaseComp('InputAdornment', ({ prev, next, ...props }) => <InputAdornment prepend={prev} append={next} {...props} />)
  registerBaseComp('Button', ({ theme, ...props }) => <Button
    theme={({
      info: 'default',
      error: 'danger',
      warning: 'warning',
      success: 'success',
    } as const)[theme]}
    {...props}
  />)
  registerBaseComp('Select', props => <Select
    {...props}
    value={props.value}
    onChange={v => props.onChange?.(v as any)}
  />)
  registerBaseComp('Switch', props => <Switch {...props}/>)
  registerBaseComp('Dropdown', props => {
    return <Dropdown
      popupProps={{ showArrow: true }}
      options={props.menu.map(i => ({
        prefixIcon: typeof i.icon === 'string'
          ? <Icon name={i.icon as any} />
          : i.icon,
        content: typeof i.label === 'string'
          ? <span title={i.title}>{i.label}</span>
          : React.cloneElement(i.label, {
            title: i.title
          }),
        value: i.value,
        disabled: i.disabled
      }))}
      trigger={props.trigger ?? 'click'}
      minColumnWidth={120}
      onClick={i => {
        // @ts-ignore
        props.onAction(i.value, i)
      }}
    >
      {props.children}
    </Dropdown>
  })

  addController('Number:Slider', props => <Slider {...props} />)
  addController('String.TextArea', props => <Textarea
    autosize={{
      minRows: 1,
    }}
    {...props}
  />)
  addController('Date:Picker', ({
    isPanel,
    datetime: [enableDate, enableTime] = [true, true],
    ...props
  }) => {
    if (!enableDate) {
      return isPanel
        ? <TimePickerPanel onChange={() => {}} {...props} />
        : <TimePicker {...props} />
    }
    const nProps = {
      ...props,
      enableTimePicker: enableDate && enableTime
    }
    return isPanel
      ? <DatePickerPanel {...nProps} />
      : <DatePicker {...nProps} />
  })
  addController('Date:PickerRange', ({
    isPanel,
    datetime: [enableDate, enableTime] = [true, true],
    ...props
  }) => {
    if (props.value === undefined)
      props.value = []

    if (!enableDate && enableTime) {
      return isPanel
        ? <>TDesign unable support&nbsp;<code>TimePickerPanel</code>.</>
        : <TimeRangePicker {...props} />
    }
    const nProps = {
      ...props,
      enableTimePicker: enableDate && enableTime
    }
    return isPanel
      ? <DateRangePickerPanel {...nProps} />
      : <DateRangePicker {...nProps} />
  })
}
