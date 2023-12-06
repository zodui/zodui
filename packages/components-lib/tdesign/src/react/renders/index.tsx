import { definePlugin } from '@zodui/core'
import { useValue } from '@zodui/react'
import { useCallback } from 'react'
import {
  DatePicker, DatePickerPanel, DateRangePicker, DateRangePickerPanel,
  Slider,
  Textarea,
  TimePicker, TimePickerPanel, TimeRangePicker
} from 'tdesign-react/esm'

import { calcTimeStr } from '../../utils'

export const RendersOfTDesignComponentsLibForReact = definePlugin('TDesign.React.Renders', ctx => {
  const ctxFgt = ctx.framework('react')
  ctxFgt
    .defineRndr('Number:Slider', props => {
      const [value, changeValue] = useValue(props.value, props.defaultValue, props.onChange)
      return <Slider
        {...props}
        value={value}
        // @ts-ignore
        onChange={changeValue}
        {...(props.range ? {
          defaultValue: props.defaultValue ?? [0, 0],
          // @ts-ignore
          onChange: ([l, r]: number[]) => changeValue?.([l ?? 0, r ?? 0])
        } : {})}
      />
    })
    .defineRndr('String:TextArea', props => <Textarea
      autosize={{
        minRows: 1
      }}
      {...props}
    />)
    .defineRndr('Date:Picker', ({
      isPanel,
      datetime: [enableDate, enableTime] = [true, true],
      ...props
    }) => {
      const onChange = props.onChange
      const changeValue = useCallback((v: string | number | Date) => {
        if (v === undefined)
          return onChange?.(undefined)

        return onChange?.(new Date(v))
      }, [onChange])
      if (!enableDate) {
        const time = calcTimeStr(props.value)
        const defaultTime = calcTimeStr(props.defaultValue)
        return isPanel
          ? <TimePickerPanel
            {...props}
            value={defaultTime || time}
            // TODO 我也搞不懂为什么这个 onChange 函数的类型是 Function，我只能这样写了
            //      有空可以去 declare module 里面将类型改一下，或者 push 一下上游更新这个类型
            //      先这么凑合用用
            onChange={(v: string) => changeValue(`1970-01-01 ${v}`)}
          />
          : <TimePicker
            {...props}
            value={time}
            defaultValue={defaultTime}
            onChange={v => changeValue(`1970-01-01 ${v}`)}
          />
      }
      const nProps = {
        ...props,
        enableTimePicker: enableDate && enableTime
      }
      return isPanel
        ? <DatePickerPanel
          {...nProps}
          // TODO 救救我吧，这都是写什么类型啊，为什么这个破 panel 还不支持 valueType 的呀，要命
          onChange={v => changeValue(v)}
        />
        : <DatePicker
          {...nProps}
          valueType='Date'
          onChange={v => changeValue(v)}
        />
    })
    .defineRndr('Range:Date:Picker', ({
      isPanel,
      datetime: [enableDate, enableTime] = [true, true],
      ...props
    }) => {
      if (props.value === undefined)
        props.value = []

      if (!enableDate && enableTime) {
        return isPanel
          ? <>TDesign unable support&nbsp;<code>TimePickerRangePanel</code>.</>
          : <TimeRangePicker
            {...props}
            value={[
              calcTimeStr(props.value[0]),
              calcTimeStr(props.value[1])
            ]}
            defaultValue={[
              calcTimeStr(props.defaultValue[0]),
              calcTimeStr(props.defaultValue[1])
            ]}
            onChange={v => props.onChange?.([
              new Date(`1970-01-01 ${v[0]}`),
              new Date(`1970-01-01 ${v[1]}`)
            ])}
          />
      }
      const nProps = {
        ...props,
        enableTimePicker: enableDate && enableTime
      }
      return isPanel
        ? <DateRangePickerPanel
          {...nProps}
          onChange={v => props.onChange?.([
            new Date(v[0]),
            new Date(v[1])
          ])}
        />
        : <DateRangePicker
          {...nProps}
          valueType='Date'
          onChange={v => props.onChange?.([
            new Date(v[0]),
            new Date(v[1])
          ])}
        />
    })
})
