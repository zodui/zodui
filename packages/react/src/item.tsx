import './item.scss'

import z, { ZodFirstPartyTypeKind } from 'zod'
import React, { useMemo } from 'react'
import { Button } from 'tdesign-react/esm'

import { NeedWrapModes } from './configure'
import { getModes, isWhatType, useDefaultValue } from './utils'
import { Controller } from './controller'
import { Icon } from './components'

export interface ItemProps {
  label: string
  disabled?: boolean
  value?: any
  onChange?: (value: any) => void | Promise<void>
  defaultValue?: any
  schema: z.Schema
  className?: string
}

export function Item(props: ItemProps) {
  const {
    schema,
    className
  } = props
  const defaultValue = useDefaultValue(schema) ?? props.defaultValue
  if (isWhatType(schema, ZodFirstPartyTypeKind.ZodDefault)) {
    const {
      innerType,
      defaultValue: _,
      typeName: __,
      ...assignDefFields
    } = schema._def
    Object.assign(innerType._def, assignDefFields)
    return <Item {...props}
                 schema={innerType}
                 defaultValue={defaultValue}
    />
  }
  const wrapDefault = useMemo(
    () => NeedWrapModes.some(mode => {
      const modes = getModes(schema._mode)
      if (typeof mode === 'string')
        return modes.some(r => r?.startsWith(mode))
      else
        return modes.some(r => mode.test(r))
    }),
    [schema._mode]
  )

  return <div className={
    `zodui-item ${schema.type}`
    + (wrapDefault ? ' wrap' : '')
    + (schema._mode ? ` ${schema._mode}` : '')
    + (className ? ` ${className}` : '')
  }>
    <div className='zodui-item__more'>
      <Button
        shape='square'
        variant='text'
        icon={<Icon name='More' />}
      />
    </div>
    <div className='zodui-item__label'>
      {props.label}
      {schema._def.description && <div className='zodui-item__label-description'>
        {schema._def.description}
      </div>}
    </div>
    <div className='zodui-item__control'>
      {/* TODO resolve defaultValue */}
      <Controller
        schema={schema}
        defaultValue={defaultValue}
        disabled={props.disabled}
      />
    </div>
  </div>
}
