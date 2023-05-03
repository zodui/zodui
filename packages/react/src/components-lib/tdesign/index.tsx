import 'tdesign-react/esm/style/index.js'

import { addController } from '@zodui/react'
import React from 'react'
import {
  DatePicker, DatePickerPanel, DateRangePicker,
  DateRangePickerPanel,
  Slider,
  Textarea,
  TimePicker, TimePickerPanel, TimeRangePicker
} from 'tdesign-react/esm'

{
  addController('Number:Slider', props => <Slider {...props} />)
  addController('String.TextArea', props => <Textarea
    autosize={{
      minRows: 1
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
