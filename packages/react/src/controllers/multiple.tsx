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
import { AllTypes, getDefaultValue, isWhatType, Mutable, TypeMap, useModes } from '../utils'
import { KeyEditableTypes, MultipleSchemas } from '../configure'
import { Icon, Button, Input } from '../components'
import { plgMaster } from '../plugins'

import '../plugins/common-list'
import { useErrorHandlerContext } from '../contexts/error-handler'

const prefix = 'zodui-item__control-list'

const innerMultipleTypes = [
  AllTypes.ZodArray,
  AllTypes.ZodTuple,
  AllTypes.ZodSet,
  AllTypes.ZodMap,
  AllTypes.ZodRecord,
  AllTypes.ZodObject,
] as const

export const multiple = innerMultipleTypes as Mutable<typeof innerMultipleTypes>

export type MultipleType = (typeof multiple)[number]

export interface MultipleProps extends ControllerProps<TypeMap[MultipleType]> {
}

export function Multiple({
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

  const isMultipleSchema = useMemo(() => MultipleSchemas.includes(schema._def.typeName), [schema._def.typeName])

  const modes = useModes(schema)

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

  const targetPlgs = plgMaster.plgs[schema._def.typeName]
  for (const { componentMatchers } of targetPlgs) {
    for (const compMatcher of componentMatchers) {
      if (compMatcher.is(modes, { schemas }))
        return <compMatcher.Component
          {...props}
          modes={modes}
          schema={schema}
          value={list}
          onChange={setList}
        />
    }
  }

  return <div className={
    prefix
    + ((list?.length ?? 0) === 0 ? ' empty' : '')
  }>
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
             *      disable or hidden optioin when it selected
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
    })}
  </div>
}
