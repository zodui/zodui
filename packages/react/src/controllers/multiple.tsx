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
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'

import { Controller, ControllerProps } from './index'
import { AllType, AllTypes, getDefaultValue, isWhatType, TypeMap } from '../utils'
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

  const isComplex = useMemo(() => ComplexMultipleTypes.includes(schema._def.typeName), [schema._def.typeName])

  const addNewItem = useCallback((type: 'append' | 'prepend' = 'append') => setList(l => {
    const t = [getDefaultValue(getSchema())]
    if (l === undefined)
      return t

    return type === 'append' ? l.concat(t) : t.concat(l)
  }), [getSchema])

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
      value={list}
      onChange={setList}
    />
  : <>
    {(list?.length ?? 0) === 0 && <Button
      className={`${prefix}-create`}
      icon='Add'
      onClick={() => addNewItem()}
    />}
    {list?.map((item, index) => {
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
        <Controller
          disabled={props.disabled ?? false}
          className={`${prefix}-item__container`}
          schema={itemSchema}
          value={item}
          defaultValue={getDefaultValue(itemSchema)}
          onChange={value => {
            const newList = [...list]
            newList[index] = value
            setList(newList)
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
    })}
  </>
}
