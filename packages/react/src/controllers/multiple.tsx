import './multiple.scss'

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
import React, { Fragment, useCallback, useMemo, useRef, useState } from 'react'

import { Controller, ControllerProps } from './index'
import { AllType, AllTypes, getDefaultValue, isWhatType, isWhatTypes, TypeMap } from '../utils'
import { KeyEditableTypes, ComplexMultipleTypes, MultipleType } from '../configure'
import { Icon, Button, Input } from '../components'
import { plgMaster } from '../plugins'

import { useErrorHandlerContext } from '../contexts/error-handler'

declare module '@zodui/react' {
  export interface MultipleSubController {
    props: {
      schemas: TypeMap[AllType][]
    }
    options: {
      schemas: TypeMap[AllType][]
    }
  }
  interface SubControllerMap {
    multiple: MultipleSubController
  }
}

const prefix = 'multiple'

export interface MultipleProps extends ControllerProps<TypeMap[MultipleType]> {
}

export function Multiple({
  uniqueKey,
  modes,
  schema,
  ...props
}: MultipleProps) {
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
  }, [commonDef.typeName, commonDef.shape])
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

  const schemas = useMemo(() => {
    if (isWhatType(schema, AllTypes.ZodTuple)) {
      return schema._def.items
    }
    if (isWhatType(schema, AllTypes.ZodObject)) {
      return Object.values(dict)
    }
    if (
      isWhatType(schema, AllTypes.ZodSet)
      || isWhatType(schema, AllTypes.ZodRecord)
      || isWhatType(schema, AllTypes.ZodMap)
    ) {
      return Array.from({ length: schemasLength }).map((_, i) => getSchema(i))
    }
    return []
  }, [dict, commonDef.typeName, commonDef.items, commonDef.valueType])

  const [_, setRigger] = useState(false)
  const listRef = useRef<any[]>(
    Object.keys(dict).length > 0
    ? Object
        .entries(dict)
        .map(([k, v]) => {
          if (props.value && props.value[k] !== undefined) {
            return props.value[k]
          }
          if (props.defaultValue && props.defaultValue[k] !== undefined) {
            return props.defaultValue[k]
          }
          return getDefaultValue(v)
        })
    : props.value ?? props.defaultValue
      ? Object.entries(props.value ?? props.defaultValue).map(([, v]) => v)
      : isWhatType(schema, AllTypes.ZodTuple)
        ? schema._def.items.map(getDefaultValue)
        : []
  )
  const changeList = useCallback((value?: any[]) => {
    if (value !== undefined) {
      listRef.current = value
    }
    let v = listRef.current.reduce((acc, v, i) => ({
      ...acc,
      [dictKeys[i] ?? i]: v
    }), {})
    if (isWhatTypes(schema, [AllTypes.ZodArray, AllTypes.ZodTuple, AllTypes.ZodSet])) {
      v = listRef.current
    }
    props.onChange?.(v)
  }, [props.onChange])

  const addNewItem = useCallback((type: 'append' | 'prepend' = 'append') => {
    const l = listRef.current

    const t = [getDefaultValue(getSchema())]
    if (l === undefined) {
      listRef.current = t
    } else {
      listRef.current = type === 'append' ? l.concat(t) : t.concat(l)
    }
    setRigger(r => !r)
    changeList()
  }, [getSchema])

  const dictKeys = useMemo(() => Object.keys(dict ?? {}), [ dict ])
  const [keys, setKeys] = useState<string[]>([])

  const isComplex = useMemo(() => ComplexMultipleTypes.includes(schema._def.typeName), [schema._def.typeName])

  const errorHandler = useErrorHandlerContext()

  if (schemas.length === 0 && schema._def.typeName === AllTypes.ZodTuple) {
    return errorHandler.throwError(new Error('Tuple 类型必须包含一个元素'))
  }

  const { Component } = plgMaster.reveal(schema._def.typeName, 'SubController.multiple', [modes, { schemas }]) ?? {}

  return Component
  ? <Component
      {...props}
      modes={modes}
      schema={schema}
      schemas={schemas}
      value={listRef.current}
      onChange={changeList}
    />
  : <>
    {listRef.current.length === 0 && <Button
      className={`${prefix}-create`}
      icon='Add'
      onClick={() => addNewItem()}
    />}
    {listRef.current.map((item, index) => {
      const itemSchema = getSchema(index)
      // fix delete schema flashing
      if (!itemSchema) return <Fragment key={index} />;

      const isKeyEditable = KeyEditableTypes.includes(schema._def.typeName)

      return <div className={`${prefix}-item`} key={index}>
        {/* TODO display description */}
        {(
          (dictKeys[index] ?? itemSchema?._def.label) || isKeyEditable
        ) && <div className={
          `${prefix}-item__label`
          + (isKeyEditable ? ' editable' : '')
        }>
          {isKeyEditable
            /*
             * TODO use select when key is union literal type
             *      disable or hidden option when it selected
             */
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
        <div className={`${prefix}-item__index-tag`}>
          {index + 1}
        </div>
        {!isComplex && <>
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
                let temp = listRef.current[index]
                listRef.current[index] = listRef.current[index - 1]
                listRef.current[index - 1] = temp
                setRigger(r => !r)
                changeList()
              }}
            />}
          {index === listRef.current.length - 1
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
                let temp = listRef.current[index]
                listRef.current[index] = listRef.current[index + 1]
                listRef.current[index + 1] = temp
                setRigger(r => !r)
                changeList()
              }}
            />}
        </>}
        <Controller
          disabled={props.disabled ?? false}
          className={`${prefix}-item__container`}
          schema={itemSchema}
          value={item}
          defaultValue={getDefaultValue(itemSchema)}
          onChange={value => {
            listRef.current[index] = value
            changeList()
          }}
        />
        <Button
          theme='error'
          disabled={
            isComplex
              ? props.disabled ?? (item === undefined)
              : props.disabled
          }
          icon={isComplex ? 'Clear' : 'Delete'}
          onClick={() => {
            if (isComplex) {
              listRef.current[index] = undefined
            } else {
              listRef.current = listRef.current.filter((_, i) => i !== index)
            }
            setRigger(r => !r)
            changeList()
          }}
        />
        <Button icon='More' />
      </div>
    })}
  </>
}
