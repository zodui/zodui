import './item.scss'

import type { DescriptorProps, DescriptorRef } from '@zodui/core'
import { AllTypes, WrapModes } from '@zodui/core'
import { classnames, debounce, getModes, inlineMarkdown } from '@zodui/core/utils'
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import type { Schema } from 'zod'
import { ZodError } from 'zod'

import {
  Button, Dropdown
} from '../../components'
import {
  useErrorHandler, useItemConfigurerContext, useItemSerter
} from '../../contexts'
import {
  Switcher
} from '../../switchers'

const prefix = 'zodui-item'

export interface ItemRef extends DescriptorRef {
}

export interface ItemProps<M extends Schema = any> extends DescriptorProps<M> {
  className?: string
}

function InnerItem<M extends Schema>(props: ItemProps<M>, ref: React.ForwardedRef<ItemRef>) {
  const configure = useItemConfigurerContext()
  const {
    meta: {
      label,
      description
    },
    model,
    className
  } = props
  const wrapDefault = useMemo(
    () => WrapModes.some(mode => {
      const modes = getModes(model._mode)
      if (typeof mode === 'string')
        return modes.some(r => r?.startsWith(mode))
      else
        return modes.some(r => mode.test(r))
    }),
    [model._mode]
  )

  const { Append, ItemSerter } = useItemSerter()

  const { error, ErrorHandler } = useErrorHandler()

  const [_, rerender] = useState(false)
  const valueRef = useRef<number>(props.value ?? props.defaultValue)
  const valueChangeListener = useRef<(v: any) => any>()
  const onValueChange = useCallback((func: (v: any) => any) => {
    valueChangeListener.current = func
    return () => {
      valueChangeListener.current = undefined
    }
  }, [])
  // FIXME the next line is working but eslint isn't happy
  //       with the dependency array
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  }, configure.verifyDebounceTime), [model, configure.actualTimeVerify])

  useImperativeHandle(ref, () => ({
    verify: async () => {
      return changeValue(valueRef.current, false, true)
    }
  }), [changeValue])

  return <ItemSerter>
    <ErrorHandler>
      <div
        className={classnames(`${prefix} ${model.type}`, {
          error: !!error,
          wrap: wrapDefault,
          [model._mode]: !!model._mode,
          [className]: !!className
        })}>
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
              }
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
          'is-optional': model._def.typeName === AllTypes.ZodOptional
        })}>
          {label}
          {description
            && <pre
              className={`${prefix}__label-description inline-md`}
              dangerouslySetInnerHTML={{ __html: inlineMarkdown(description) }}
            />}
        </div>
        <Switcher
          uKey={props.uKey}
          model={model}
          disabled={props.disabled}
          value={valueRef.current}
          defaultValue={props.defaultValue}
          onChange={changeValue}
        />
      </div>
    </ErrorHandler>
    <Append />
    <ValueChecker value={valueRef.current}
                  schema={model}
                  onValueChange={onValueChange}
    />
    {error &&
      <div className={`${prefix}__error`}>
        {error.message}
      </div>}
  </ItemSerter>
}

/**
 * Item
 * - check controller data
 * - common contexts
 * - value operate and support extensible
 */
export const Item = forwardRef(InnerItem) as {
  <M extends Schema>(
    props: ItemProps<M> & { ref?: React.ForwardedRef<ItemRef> }
  ): React.ReactElement
  displayName?: string
}

Item.displayName = 'Item'

function ValueChecker({
  value,
  schema,
  onValueChange
}: {
  value: any
  schema: Schema
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
  }, [actualTimeVerify, value, schema, parse, onValueChange])
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
