import 'tdesign-react/esm/style/index.js'

import { definePlugin } from '@zodui/core'
import type { Narrow } from '@zodui/core/utils'
import { Icon } from '@zodui/react'
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
  Button, Dropdown,
  Input, InputAdornment,
  InputNumber, Select, Switch
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

export const TDesignComponentsLibForReact = definePlugin('TDesign', ctx => {
  const ctxFgt = ctx.framework('react')
  ctxFgt
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
    .defineComp('Button', ({ theme, ...props }) => <Button
      theme={({
        info: 'default',
        error: 'danger',
        warning: 'warning',
        success: 'success',
      } as const)[theme]}
      {...props}
    />)
    .defineComp('Select', props => <Select
      {...props}
      value={props.value}
      onChange={v => props.onChange?.(v as any)}
    />)
    .defineComp('Switch', props => <Switch {...props}/>)
    .defineComp('Dropdown', props => <Dropdown
      popupProps={{
        showArrow: true,
        overlayClassName: 'zodui-tdesign-popup',
        popperOptions: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [4, 0],
              },
            },
          ],
        }
      }}
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
    </Dropdown>)
  ctxFgt
    .defineIcon('Add', AddIcon)
    .defineIcon('More', MoreIcon)
    .defineIcon('Link', LinkIcon)
    .defineIcon('Clear', ClearIcon)
    .defineIcon('Delete', DeleteIcon)
    .defineIcon('Prepend', props => <RollbackIcon style={{
      transform: 'rotate(90deg)'
    }} />)
    .defineIcon('Append', props => <RollbackIcon style={{
      transform: 'rotate(-90deg)'
    }} />)
    .defineIcon('ArrowUp', ArrowUpIcon)
    .defineIcon('ArrowDown', ArrowDownIcon)
})

export default TDesignComponentsLibForReact
