import './item.scss'

import { ZodError, Schema as ZodSchema } from 'zod'
import React, { useCallback, useEffect, useMemo, useRef, useState, useImperativeHandle, forwardRef } from 'react'

import { WrapModes } from './configure'
import { AllTypes, classnames, debounce, getModes, inlineMarkdown } from '@zodui/core'
import { Controller } from './controllers'
import { Button, Dropdown } from './components'
import { useErrorHandler } from './contexts/error-handler'
import { useItemSerter } from './contexts/item-serter'
import { useItemConfigurerContext } from './contexts/item-configurer'

const prefix = 'zodui-item'

export interface ItemRef {
  verify: () => Promise<any>
}

export interface ItemProps {
  uniqueKey?: string
  label: string
  disabled?: boolean
  value?: any
  onChange?: (value: any) => (void | Promise<void>)
  defaultValue?: any
  schema: ZodSchema
  className?: string
}

/**
 * Item
 * - check controller data
 * - common contexts
 * - value operate and support extensible
 */
export const Item = forwardRef<ItemRef, ItemProps>((props, ref) => {
  const configure = useItemConfigurerContext()
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

  const [_, rerender] = useState(false)
  const valueRef = useRef<number>(props.value ?? props.defaultValue)
  const valueChangeListener = useRef<(v: any) => any>()
  const onValueChange = useCallback((func: (v: any) => any) => {
    valueChangeListener.current = func
    return () => {
      valueChangeListener.current = undefined
    }
  }, [])
  const changeValue = useCallback(debounce(async (v: any, must = false, doVerify = configure.actualTimeVerify) => {
    try {
      const rv = doVerify
        ? await valueChangeListener.current?.(v) ?? v
        : v
      await props.onChange?.(rv)
      valueRef.current = rv
    } catch (e) {
      if (e instanceof ZodError) {
        // if configure must param, then must be set value, but not emit value change out
        if (must) {
          valueRef.current = v
        }
        // TODO dispatch error resolve logic
      } else
        throw e
    }
    if (must) {
      rerender(r => !r)
    }
    // TODO make delay configurable
  }, configure.verifyDebounceTime), [schema, configure.actualTimeVerify])

  useImperativeHandle(ref, () => ({
    verify: async () => {
      return changeValue(valueRef.current, false, true)
    }
  }), [changeValue])

  return <ItemSerter>
    <ErrorHandler>
      <div className={
        `${prefix} ${schema.type}`
        + (error ? ' error' : '')
        + (wrapDefault ? ' wrap' : '')
        + (schema._mode ? ` ${schema._mode}` : '')
        + (className ? ` ${className}` : '')
      }>
        <div className={`${prefix}__more`}>
          <Dropdown
            menu={[
              {
                icon: 'Clear',
                label: '重置',
                title: '将数据设置为默认值，若无默认值则与清空行为一致',
                value: 'reset'
              },
              {
                icon: 'Delete',
                label: '置空',
                title: '将数据设置为空值，即数据未被设置模式',
                value: 'clear'
              },
            ]}
            onAction={async v => {
              switch (v) {
                case 'reset':
                  await changeValue(props.defaultValue, true)
                  break
                case 'clear':
                  await changeValue(undefined, true)
                  break
              }
            }}
          >
            <Button shape='square' variant='text' icon='More' disabled={!!error} />
          </Dropdown>
        </div>
        <div className={classnames(`${prefix}__label`, {
          // @ts-ignore
          'is-optional': schema._def.typeName === AllTypes.ZodOptional
        })}>
          {props.label}
          {schema._def.description
            && <pre
              className={`${prefix}__label-description inline-md`}
              dangerouslySetInnerHTML={{ __html: inlineMarkdown(schema._def.description) }}
            />}
        </div>
        {!error && <Controller
          uniqueKey={props.uniqueKey}
          schema={schema}
          disabled={props.disabled}
          value={valueRef.current}
          defaultValue={props.defaultValue}
          onChange={changeValue}
        />}
      </div>
    </ErrorHandler>
    <Append />
    <ValueChecker value={valueRef.current}
                  schema={schema}
                  onValueChange={onValueChange}
    />
    {error &&
      <div className={`${prefix}__error`}>
        {error.message}
      </div>}
  </ItemSerter>
})

function ValueChecker({
  value,
  schema,
  onValueChange
}: {
  value: any
  schema: ZodSchema
  onValueChange: (func: (v: any) => any) => () => void
}) {
  const { actualTimeVerify } = useItemConfigurerContext()
  const [parseError, setParseError] = useState<ZodError>()
  const parse = useCallback(async function (v: any) {
    try {
      const nv = schema.parse(v)
      setParseError(undefined)
      return nv
    } catch (e) {
      console.warn(e)
      if (e instanceof ZodError) {
        setParseError(e)
      }
      throw e
    }
  }, [schema])
  useEffect(() => {
    // init check when configure actualTimeVerify is true
    if (actualTimeVerify)
      parse(value).catch(() => null)
    return onValueChange(parse)
  }, [value, schema, parse])
  return <div className={classnames(`${prefix}__error`, {
    none: !parseError
  })}>
    {parseError && parseError.errors.map((e, i) => <div key={i}>
      {e.path.map(p => {
        if (typeof p === 'number')
          return `${p}nd`
        return p
      }).join('.')} {e.message}
    </div>)}
  </div>
}
