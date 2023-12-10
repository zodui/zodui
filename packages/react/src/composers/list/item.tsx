import './item.scss'

import type { DescriptorProps, DescriptorRef } from '@zodui/core'
import { AllTypes, WrapModes } from '@zodui/core'
import { classnames, getModes, inlineMarkdown } from '@zodui/core/utils'
import type { ForwardedRef, ReactElement } from 'react'
import {
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

import { Button } from '../../components/button'
import { Dropdown } from '../../components/dropdown'
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

export const useRetimer = () => {
  const timerIdRef = useRef<number>()

  return useCallback((timerId?: number) => {
    if (typeof timerIdRef.current === 'number') {
      clearTimeout(timerIdRef.current)
    }
    timerIdRef.current = timerId
  }, [])
}

function InnerItem<M extends Schema>(props: ItemProps<M>, ref: ForwardedRef<ItemRef>) {
  const configure = useItemConfigurerContext()
  const {
    meta: {
      label,
      description
    },
    value,
    defaultValue,
    onChange,
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
  const [isMustSet, setIsMustSet] = useState(false)
  const valueRef = useRef(value ?? defaultValue)
  if (valueRef.current !== value && !isMustSet) {
    valueRef.current = value
  }
  const valueChangeListener = useRef<(v: any) => any>()
  const onValueChange = useCallback((func: (v: any) => any) => {
    valueChangeListener.current = func
    return () => {
      valueChangeListener.current = undefined
    }
  }, [])
  const valueChangeRetimer = useRetimer()
  const changeValue = useCallback((v: any, must = false, doVerify = configure.actualTimeVerify) => {
    valueChangeRetimer(setTimeout(async () => {
      const prev = valueRef.current
      try {
        const rv = doVerify
          ? await valueChangeListener.current?.(v) ?? v
          : v
        valueRef.current = rv
        await onChange?.(rv)
        setIsMustSet(must)
      } catch (e) {
        valueRef.current = prev
        if (e instanceof ZodError) {
          // if configure must param, then must be set value, but not emit value change out
          if (must) {
            valueRef.current = v
            setIsMustSet(true)
          }
          // TODO dispatch error resolve logic
        } else
          throw e
      }
      if (must) {
        rerender(r => !r)
      }
      // TODO make delay configurable
    }, configure.verifyDebounceTime) as unknown as number)
  }, [
    valueChangeRetimer,
    configure.verifyDebounceTime,
    configure.actualTimeVerify,
    onChange
  ])

  useImperativeHandle(ref, () => ({
    verify: async () => {
      return changeValue(valueRef.current, false, true)
    }
  }), [changeValue])

  return <ItemSerter>
    <ErrorHandler>
      <div
        className={classnames(
          `${prefix} ${model.type}`,
          {
            error: !!error,
            wrap: wrapDefault,
            [model._mode]: !!model._mode
          },
          !!className && className
        )}>
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
                  changeValue(defaultValue, true)
                  break
                case 'clear':
                  changeValue(undefined, true, false)
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
          defaultValue={defaultValue}
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
    props: ItemProps<M> & { ref?: ForwardedRef<ItemRef> }
  ): ReactElement
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
