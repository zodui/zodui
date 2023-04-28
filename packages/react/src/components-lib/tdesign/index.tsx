import './tdesign.scss'
import React from 'react'
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
import 'tdesign-react/esm/style/index.js'

import { addController, registerIcon, registerBaseComp, Icon } from '@zodui/react'
import { Narrow } from '@zodui/core/utils'

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
