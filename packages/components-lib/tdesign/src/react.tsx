import './react.scss'
import 'tdesign-react/esm/style/index.js'

import { definePlugin } from '@zodui/core'
import { classnames } from '@zodui/core/utils'
import type { Narrow } from '@zodui/core/utils'
import { Icon } from '@zodui/react'
import { cloneElement } from 'react'
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
  DatePicker, DatePickerPanel, DateRangePicker, DateRangePickerPanel,
  Dropdown,
  Input, InputAdornment, InputNumber,
  Radio,
  Select,
  Slider,
  Switch,
  Textarea,
  TimePicker, TimePickerPanel, TimeRangePicker
} from 'tdesign-react/esm'

declare module '@zodui/core' {
  export interface FrameworkComponentsTDesignReact {
  }
  export interface FrameworkComponents {
    TDesign: {
      react: FrameworkComponentsTDesignReact
    }
  }
}

function isTargetType<T, Types extends T>(t: T | Types, types: Narrow<Types[]>): t is Types {
  // @ts-ignore
  return types.includes(t)
}

function calcTimeStr(v?: Date) {
  return v ? `${v.getHours()}:${v.getMinutes()}:${v.getSeconds()}` : undefined
}

export const TDesignComponentsLibForReact = definePlugin('TDesign', ctx => {
  const ctxFgt = ctx.framework('react')
  ctxFgt
    .defineComp('Button', ({ theme, ...props }) => <Button
      theme={({
        info: 'default',
        error: 'danger',
        warning: 'warning',
        success: 'success'
      } as const)[theme]}
      {...props}
    />)
    .defineComp('Input', ({
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
    .defineComp('InputAdornment', ({ prev, next, ...props }) => (
      <InputAdornment prepend={prev} append={next} {...props} />
    ))
    .defineComp('Select', props => <Select
      {...props}
      value={props.value}
      onChange={v => props.onChange?.(v as any)}
    />)
    .defineComp('Switch', props => <Switch {...props} />)
    .defineComp('RadioGroup', props => <Radio.Group
      allowUncheck
      className={classnames(props.className, {
        [`zodui-tdesign-radio-group--direction-${props.direction ?? 'row'}`]: !!props.direction
      })}
      variant={({
        outline: 'outline',
        card: 'default-filled',
        undefined: undefined
      } as const)[props.variant]}
      options={props.variant !== 'outline' ? props.options : []}
      value={props.value}
      defaultValue={props.defaultValue}
      onChange={v => props.onChange?.(v as any)}
      >
      {props.variant === 'outline' ? props.options.map(opt => <Radio.Button
        key={opt.value}
        value={opt.value}
        title={opt.title}
        disabled={opt.disabled}
      >{opt.label}</Radio.Button>) : null}
    </Radio.Group>)
    .defineComp('Dropdown', props => <Dropdown
        popupProps={{
          showArrow: true,
          overlayClassName: 'zodui-tdesign-popup',
          popperOptions: {
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [4, 0]
                }
              }
            ]
          }
        }}
        options={props.menu.map(i => ({
          prefixIcon: typeof i.icon === 'string'
            ? <Icon name={i.icon as any} />
            : i.icon,
          content: typeof i.label === 'string'
            ? <span title={i.title}>{i.label}</span>
            : cloneElement(i.label, {
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
    </Dropdown>)
  ctxFgt
    .defineIcon('Add', AddIcon)
    .defineIcon('More', MoreIcon)
    .defineIcon('Link', LinkIcon)
    .defineIcon('Clear', ClearIcon)
    .defineIcon('Delete', DeleteIcon)
    .defineIcon('Prepend', props => <RollbackIcon style={{ transform: 'rotate(90deg)' }} {...props} />)
    .defineIcon('Append', props => <RollbackIcon style={{ transform: 'rotate(-90deg)' }} {...props} />)
    .defineIcon('ArrowUp', ArrowUpIcon)
    .defineIcon('ArrowDown', ArrowDownIcon)
  ctxFgt
    .defineRndr('Number:Slider', props => <Slider {...props} />)
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
            onChange={(v: string) => props.onChange?.(new Date(`1970-01-01 ${v}`))}
          />
          : <TimePicker
            {...props}
            value={time}
            defaultValue={defaultTime}
            onChange={v => props.onChange?.(new Date(`1970-01-01 ${v}`))}
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
          onChange={v => props.onChange?.(new Date(v))}
        />
        : <DatePicker
          {...nProps}
          valueType='Date'
          onChange={v => props.onChange?.(new Date(v))}
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

export default TDesignComponentsLibForReact
