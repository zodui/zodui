import './item.scss'

import z from 'zod'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'

import { WrapModes } from './configure'
import { getModes, inlineMarkdown } from './utils'
import { Controller } from './controllers'
import { Button } from './components'
import { useErrorHandler } from './contexts/error-handler'
import { useItemSerter } from './contexts/item-serter'

export interface ItemProps {
  label: string
  disabled?: boolean
  value?: any
  onChange?: (value: any) => (void | Promise<void>)
  defaultValue?: any
  schema: z.Schema
  className?: string
}

/**
 * Item
 * - check controller data
 * - common contexts
 * - value operate and support extensible
 */
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

  const { Append, ItemSerter } = useItemSerter()

  const { reset, error, ErrorHandler } = useErrorHandler()

  useEffect(() => {
    if (error) reset()
  }, [schema])

  const value = useRef<number>(props.value ?? props.defaultValue)
  const changeValue = useCallback((v: any) => {
    // TODO verify value
    props.onChange?.(v)
    value.current = v
  }, [])

  return <ItemSerter>
    <ErrorHandler>
      <div className={
        `zodui-item ${schema.type}`
        + (error ? ' error' : '')
        + (wrapDefault ? ' wrap' : '')
        + (schema._mode ? ` ${schema._mode}` : '')
        + (className ? ` ${className}` : '')
      }>
        <div className='zodui-item__more'>
          <Button shape='square' variant='text' icon='More' disabled={!!error} />
        </div>
        <div className='zodui-item__label'>
          {props.label}
          {schema._def.description
            && <pre
              className='zodui-item__label-description inline-md'
              dangerouslySetInnerHTML={{ __html: inlineMarkdown(schema._def.description) }}
            />}
        </div>
        {!error && <Controller
          schema={schema}
          disabled={props.disabled}
          value={value.current}
          defaultValue={props.defaultValue}
          onChange={changeValue}
        />}
      </div>
    </ErrorHandler>
    <Append />
    {error &&
      <div className='zodui-item__error'>
        {error.message}
      </div>}
  </ItemSerter>
}
