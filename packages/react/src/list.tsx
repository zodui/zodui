import './list.scss'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, DateRangePicker, Input, Slider, TimeRangePicker } from 'tdesign-react/esm'

import { ControllerProps } from './controller'
import { useModes } from './utils'
import { primitive, Primitive } from './primitive'
import { isDatetimeUnion, Union } from './union'
import { KeyEditableTypes, UseSchemasForList } from './configure'
import { Icon } from './components'

export interface ListProps extends ControllerProps {
}

export function List({
  schema,
  ...props
}: ListProps) {
  const prefix = 'zodui-item__control-list'
  const { inner } = schema
  const schemas = useMemo(() => {
    if (schema.type === 'object') {
      return Object.entries(schema.dict ?? {}).map(([key, s]) => {
        if (s.meta.label === undefined)
          return s.label(key)
        if (s.meta.description === undefined)
          return s.description(key)
        return s
      })
    }
    return schema.list
  }, [ schema.type, schema.dict, schema.list ])
  const dictKeys = useMemo(() => Object.keys(schema.dict ?? {}), [ schema.dict ])
  const [keys, setKeys] = useState<string[]>([])

  const Controller = useCallback((props: ControllerProps) => primitive.includes(props.schema.type)
    ? <Primitive {...props}/>
    : props.schema.type === 'union'
    ? <Union {...props}/>
    : ['array', 'tuple'].includes(props.schema.type)
    ? <List {...props} />
    : <>暂未支持的的类型 <code>{props.schema.type}</code></>, [
  ])

  const isTuple = useMemo(() => schema.type === 'tuple', [schema.type])
  const isSchemas = useMemo(() => UseSchemasForList.includes(schema.type), [schema.type])

  const modes = useModes(schema)
  const isRange = useMemo(() => {
    return !modes.includes('no-range')
      && schemas?.length === 2
  }, [modes, schemas?.length])
  const isSlider = useMemo(() => {
    return !modes.includes('no-slider')
      && schemas?.length === 2
  }, [modes, schemas?.length])

  const [list, setList] = useState<any[]>()
  useEffect(() => {
    setList(
      isSchemas
        ? schemas.map(s => s.meta.default)
        : props.defaultValue ?? props.value
          ? Object.entries(props.defaultValue ?? props.value).map(([, v]) => v)
          : undefined
    )
  }, [isSchemas, schemas, props.defaultValue, props.value])

  const addNewItem = useCallback((type: 'append' | 'prepend' = 'append') => setList(l => {
    const t = isSchemas ? [
      schemas[l.length].meta.default
    ] : [inner.meta.default]
    if (l === undefined)
      return t

    return type === 'append' ? l.concat(t) : t.concat(l)
  }), [isSchemas, inner, schemas])

  const isEmpty = useMemo(() => (list?.length ?? 0) === 0, [list?.length])
  // TODO resolve tuple length is 0
  const Component = useCallback(({ keys, list }: {
    keys: string[]
    list: any[]
  }) => {
    if (isEmpty)
      return <Button
        shape='square'
        variant='outline'
        className={`${prefix}-create`}
        icon={<Icon name='Add' />}
        onClick={() => addNewItem()}
      />

    if (isTuple) {
      let nl = list.length === 2 ? list : [undefined, undefined]
      if (isRange) {
        if (
          schemas[0].type === 'union' && schemas[1].type === 'union'
        ) {
          try {
            const [s0, s1] = schemas.map(s => isDatetimeUnion(s))
            switch (true) {
              case modes.includes('date'):
              case modes.includes('datetime'):
                const nProps = {
                  ...props,
                  enableTimePicker: modes.includes('datetime')
                }
                return <DateRangePicker
                  value={nl}
                  onChange={setList}
                  {...nProps}
                />
              case modes.includes('time'):
                return <TimeRangePicker
                  value={nl}
                  onChange={setList}
                  className='t-time-range-picker'
                  {...props}
                />
            }
          } catch (e) {}
        }
        if (
          schemas[0].type === 'number' && schemas[1].type === 'number'
        ) {
          // TODO support number range input
        }
      }
      if (isSlider) {
        if (
          schemas[0].type === 'number' && schemas[1].type === 'number'
        ) {
          return <Slider
            value={nl}
            onChange={setList as (v: any) => void}
            range
          />
        }
      }
    }

    return <>{list?.map((item, index) => {
      const itemSchema = schemas?.[index]
      const isKeyEditable = KeyEditableTypes.includes(schema.type)

      return <div className={`${prefix}-item`} key={index}>
        {(
          (dictKeys[index] ?? itemSchema?.meta.label) || isKeyEditable
        ) && <div className={
          `${prefix}-item__label`
          + (isKeyEditable ? ' editable' : '')
        }>
          {isKeyEditable
            ? <Input
              value={keys[index]}
              onChange={v => setKeys(keys => {
                const nKeys = keys.slice()
                nKeys[index] = v
                return nKeys
              })}
              placeholder='请输入键名'
              className='key-input'
            />
            : itemSchema.meta.label ?? dictKeys[index]}
        </div>}
        {/* TODO display description */}
        <div className={`${prefix}-item__index-tag`}>
          {index + 1}
        </div>
        {!isSchemas && <>
          {index === 0
            ? <Button
              shape='square'
              variant='outline'
              icon={<Icon name='Prepend' /> }
              onClick={() => addNewItem('prepend')}
            />
            : <Button
              shape='square'
              variant='outline'
              icon={<Icon name='ArrowUp' />}
              onClick={() => {
                const newList = [...list]
                newList[index] = newList[index - 1]
                newList[index - 1] = item
                setList(newList)
              }}
            />}
          {index === list.length - 1
            ? <Button
              shape='square'
              variant='outline'
              icon={<Icon name='Append' /> }
              onClick={() => addNewItem('append')}
            />
            : <Button
              shape='square'
              variant='outline'
              icon={<Icon name='ArrowDown' />}
              onClick={() => {
                const newList = [...list]
                newList[index] = newList[index + 1]
                newList[index + 1] = item
                setList(newList)
              }}
            />}
        </>}
        {React.cloneElement(<Controller
          schema={
            isSchemas ? itemSchema : inner
          }
          value={item}
          onChange={value => {
            const newList = [...list]
            newList[index] = value
            setList(newList)
          }}
        />, {
          defaultValue: (
            isSchemas ? itemSchema : inner
          ).meta.default,
          disabled: props.disabled ?? false,
          className: `${prefix}-item__container`,
        })}
        <Button
          shape='square'
          variant='outline'
          theme='danger'
          disabled={
            isSchemas
              ? props.disabled ?? (item === undefined)
              : props.disabled
          }
          icon={<Icon
            name={isSchemas ? 'Clear' : 'Delete'}
          />}
          onClick={() => {
            if (isSchemas) {
              const newList = [...list]
              newList[index] = undefined
              setList(newList)
            } else {
              setList(l => l.filter((_, i) => i !== index))
            }
          }}
        />
        <Button
          shape='square'
          variant='outline'
          icon={<Icon name='More' />}
        />
      </div>
    })}</>
  }, [isEmpty, isSchemas, isRange, dictKeys, addNewItem, schemas])
  return <div className={
    prefix
    + ((list?.length ?? 0) === 0 ? ' empty' : '')
  }>
    <Component keys={keys} list={list} />
  </div>
}
