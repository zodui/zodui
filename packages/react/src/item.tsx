import './item.scss'

import z from 'zod'
import React, { useEffect, useMemo } from 'react'

import { WrapModes } from './configure'
import { getModes } from './utils'
import { Controller } from './controller'
import { Button } from './components'
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
    () => WrapModes.some(mode => {
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
      + (error ? ' error' : '')
      + (wrapDefault ? ' wrap' : '')
      + (schema._mode ? ` ${schema._mode}` : '')
      + (className ? ` ${className}` : '')
    }>
      <div className='zodui-item__more'>
        <Button shape='square' variant='text' icon='More' />
      </div>
      <div className='zodui-item__label'>
        {props.label}
        {schema._def.description && <div className='zodui-item__label-description'>
          {schema._def.description}
        </div>}
      </div>
      <div className='zodui-item__control'>
        {error
          ? '组件渲染异常'
          : <Controller schema={schema} disabled={props.disabled} />}
      </div>
    </div>
    {error &&
      <div className='zodui-item__error'>
        {error.message}
      </div>}
  </ErrorHandler>
}
