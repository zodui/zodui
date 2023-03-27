import './list.scss'

import {
  ZodArrayDef,
  ZodMapDef,
  ZodObjectDef,
  ZodRawShape,
  ZodRecordDef,
  ZodSetDef,
  ZodTupleDef,
  ZodTypeDef
} from 'zod'
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { DateRangePicker, Slider, TimeRangePicker } from 'tdesign-react/esm'

import { Controller, ControllerProps } from './controller'
import { AllTypes, getDefaultValue, isWhatType, TypeMap, useModes } from './utils'
import { KeyEditableTypes, MultipleSchemas } from './configure'
import { Icon, Button, Input } from './components'
import { useErrorHandlerContext } from './error-handler'

const prefix = 'zodui-item__control-list'

export interface ListProps extends ControllerProps<TypeMap[
  | 'ZodArray'
  | 'ZodTuple'
  | 'ZodSet'
  | 'ZodMap'
  | 'ZodRecord'
  | 'ZodObject'
]> {
}

export function List({
  schema,
  ...props
}: ListProps) {
  const errorHandler = useErrorHandlerContext()

  const commonDef = schema._def as (
    & Partial<ZodArrayDef<any>>
    & Partial<ZodTupleDef>
    & Partial<ZodSetDef>
    & Partial<ZodMapDef>
    & Partial<ZodRecordDef>
    & Partial<ZodObjectDef>
  ) & ZodTypeDef
  const dict = useMemo(() => {
    if (isWhatType(schema, AllTypes.ZodObject)) {
      const dict = schema._def.shape() ?? {}
      return Object.entries(dict)
        .reduce((acc, [key , s]) => {
          let ns = s
          if (s._def.label === undefined)
            ns = s.label(key)
          if (s._def.description === undefined)
            ns = s.describe(key)
          acc[key] = ns
          return acc
        }, {} as ZodRawShape)
    }
    return {}
  }, [commonDef.typeName])
  const getSchema = useCallback((index?: number) => {
    if (isWhatType(schema, AllTypes.ZodArray)) {
      return schema._def.type
    }
    if (isWhatType(schema, AllTypes.ZodTuple)) {
      return schema._def.items[index]
    }
    if (
      isWhatType(schema, AllTypes.ZodSet)
      || isWhatType(schema, AllTypes.ZodRecord)
      || isWhatType(schema, AllTypes.ZodMap)
    ) {
      return schema._def.valueType
    }
    if (isWhatType(schema, AllTypes.ZodObject)) {
      return Object.values(dict)[index]
    }
    return null
  }, [
    dict,
    commonDef.items,
    commonDef.valueType,
    commonDef.typeName,
  ])
  const schemasLength = useMemo(() => {
    if (isWhatType(schema, AllTypes.ZodArray) || isWhatType(schema, AllTypes.ZodSet)) {
      return Infinity
    }
    if (isWhatType(schema, AllTypes.ZodTuple)) {
      return schema._def.items.length
    }
    if (isWhatType(schema, AllTypes.ZodObject)) {
      return Object.entries(schema._def.shape() ?? {}).length
    }
    return 0
  }, [commonDef])

  const [list, setList] = useState<any[]>()
  useEffect(() => {
    setList(
      Object.keys(dict).length > 0
        ? Object.values(dict).map(getDefaultValue)
        : props.defaultValue ?? props.value
          ? Object.entries(props.defaultValue ?? props.value).map(([, v]) => v)
          : isWhatType(schema, AllTypes.ZodTuple)
            ? schema._def.items.map(getDefaultValue)
            : undefined
    )
  }, [
    dict,
    commonDef.typeName,
    commonDef.items,
    props.defaultValue,
    props.value
  ])

  const dictKeys = useMemo(() => Object.keys(dict ?? {}), [ dict ])
  const [keys, setKeys] = useState<string[]>([])

  const isTuple = useMemo(() => schema.type === 'tuple', [schema.type])
  const isMultipleSchema = useMemo(() => MultipleSchemas.includes(schema._def.typeName), [schema._def.typeName])

  const modes = useModes(schema)
  const isRange = useMemo(() => {
    return !modes.includes('no-range')
      && schemasLength === 2
  }, [modes, schemasLength])
  const isSlider = useMemo(() => {
    return !modes.includes('no-slider')
      && schemasLength === 2
  }, [modes, schemasLength])

  const addNewItem = useCallback((type: 'append' | 'prepend' = 'append') => setList(l => {
    const t = [getDefaultValue(getSchema())]
    if (l === undefined)
      return t

    return type === 'append' ? l.concat(t) : t.concat(l)
  }), [getSchema])

  const isEmpty = useMemo(() => (list?.length ?? 0) === 0, [list?.length])
  const Component = useCallback(({ keys, list, schemasLength }: {
    keys: string[]
    list: any[]
    schemasLength: number
  }) => {
    if (isEmpty && !isTuple)
      return <Button
        className={`${prefix}-create`}
        icon='Add'
        onClick={() => addNewItem()}
      />

    if (isTuple) {
      if (schemasLength === 0) {
        return errorHandler.throwError(new Error('Tuple 类型必须包含一个元素'))
      }
      const [s0, s1] = [getSchema(0), getSchema(1)]
      if (isRange) {
        if (
          s0.type === 'date' && s1.type === 'date'
        ) {
          switch (true) {
            case modes.includes('time'):
              return <TimeRangePicker
                value={list}
                onChange={setList}
                className='t-time-range-picker'
                {...props}
              />
            default:
              const nProps = {
                ...props,
                enableTimePicker: modes.includes('datetime')
              }
              return <DateRangePicker
                value={list}
                onChange={setList}
                {...nProps}
              />
          }
        }
        if (
          s0.type === 'number' && s1.type === 'number'
        ) {
          // TODO support number range input
        }
      }
      if (isSlider) {
        if (
          s0.type === 'number' && s1.type === 'number'
        ) {
          return <Slider
            value={list}
            onChange={setList as (v: any) => void}
            range
          />
        }
      }
    }

    return <>{list?.map((item, index) => {
      const itemSchema = getSchema(index)
      // fix delete schema flashing
      if (!itemSchema) return <Fragment key={index}></Fragment>;

      const isKeyEditable = KeyEditableTypes.includes(schema._def.typeName)

      return <div className={`${prefix}-item`} key={index}>
        {(
          (dictKeys[index] ?? itemSchema?._def.label) || isKeyEditable
        ) && <div className={
          `${prefix}-item__label`
          + (isKeyEditable ? ' editable' : '')
        }>
          {isKeyEditable
            ? <Input
              className='key-input'
              placeholder='请输入键名'
              value={keys[index]}
              onChange={v => setKeys(keys => {
                const nKeys = keys.slice()
                nKeys[index] = v
                return nKeys
              })}
            />
            : itemSchema._def.label ?? dictKeys[index]}
        </div>}
        {/* TODO display description */}
        <div className={`${prefix}-item__index-tag`}>
          {index + 1}
        </div>
        {!isMultipleSchema && <>
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
              icon='ArrowUp'
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
              icon='ArrowDown'
              onClick={() => {
                const newList = [...list]
                newList[index] = newList[index + 1]
                newList[index + 1] = item
                setList(newList)
              }}
            />}
        </>}
        {React.cloneElement(<Controller
          schema={itemSchema}
          value={item}
          onChange={value => {
            const newList = [...list]
            newList[index] = value
            setList(newList)
          }}
        />, {
          defaultValue: getDefaultValue(itemSchema),
          disabled: props.disabled ?? false,
          className: `${prefix}-item__container`,
        })}
        <Button
          theme='error'
          disabled={
            isMultipleSchema
              ? props.disabled ?? (item === undefined)
              : props.disabled
          }
          icon={isMultipleSchema ? 'Clear' : 'Delete'}
          onClick={() => {
            if (isMultipleSchema) {
              const newList = [...list]
              newList[index] = undefined
              setList(newList)
            } else {
              setList(l => l.filter((_, i) => i !== index))
            }
          }}
        />
        <Button icon='More' />
      </div>
    })}</>
  }, [isEmpty, isMultipleSchema, isTuple, isRange, dictKeys, addNewItem])

  return <div className={
    prefix
    + ((list?.length ?? 0) === 0 ? ' empty' : '')
  }>
    <Component keys={keys} list={list} schemasLength={schemasLength}/>
  </div>
}
