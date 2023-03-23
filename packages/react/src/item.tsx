import './item.scss'

import z from 'zod'
import React, { useEffect, useMemo } from 'react'
import { Button } from 'tdesign-react/esm'

import { NeedWrapModes } from './configure'
import { getModes } from './utils'
import { Controller } from './controller'
import { Icon } from './components'
import { useErrorHandler } from './error-handler'

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

  const { reset, error, ErrorHandler } = useErrorHandler()

  useEffect(() => {
    if (error) reset()
  }, [schema])

  return <ErrorHandler>
    <div className={
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
      {error
        ? <div className='zodui-item__control'>
          组件渲染异常
        </div>
        : <div className='zodui-item__control'>
          {/* TODO resolve defaultValue */}
          <Controller
            schema={schema}
            disabled={props.disabled}
          />
        </div>}
    </div>
    {error &&
      <div className='zodui-item__error'>
        {error.message}
      </div>}
  </ErrorHandler>
}
