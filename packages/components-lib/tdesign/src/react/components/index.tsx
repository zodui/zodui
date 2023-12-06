import { definePlugin } from '@zodui/core'
import { classnames } from '@zodui/core/utils'
import { Icon } from '@zodui/react'
import { cloneElement } from 'react'
import {
  Button,
  Dropdown,
  Input, InputAdornment, InputNumber,
  Radio,
  Select,
  Switch
} from 'tdesign-react/esm'

import { isTargetType } from '../../utils'

export const ComponentsOfTDesignComponentsLibForReact = definePlugin('TDesign.React.Components', ctx => {
  const ctxFgt = ctx.framework('react')
  ctxFgt
    // eslint-disable-next-line react/jsx-no-undef
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
})
