import './tdesign.scss'
import React from 'react'
import {
  Slider,
  Textarea,
  TimePickerPanel, TimePicker, DatePickerPanel, DateRangePickerPanel, DatePicker, TimeRangePicker, DateRangePicker
} from 'tdesign-react/esm'
import 'tdesign-react/esm/style/index.js'

import { addController } from '@zodui/react'

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
