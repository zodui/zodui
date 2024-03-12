import './multiple.scss'

import type { MultipleType, TypeMap } from '@zodui/core'
import { AllTypes, ComplexMultipleTypes, KeyEditableTypes } from '@zodui/core'
import { getDefaultValue, isWhatType, isWhatTypes } from '@zodui/core/utils'
import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type {
  ZodArrayDef,
  ZodMapDef,
  ZodObjectDef,
  ZodRawShape,
  ZodRecordDef,
  ZodSetDef,
  ZodTupleDef,
  ZodTypeDef
} from 'zod'

import { Button } from '../components/button'
import { Input } from '../components/input'
import { useErrorHandlerContext } from '../contexts'
import { useCoreContextUnit } from '../hooks/useCoreContextUnit'
import type { SwitcherPropsForReact } from './index'
import { Switcher } from './index'

const prefix = 'multiple'

export interface MultipleProps extends SwitcherPropsForReact<TypeMap[MultipleType]> {
}

export function Multiple({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  uKey, // FIXME
  modes,
  model,
  onChange,
  ...props
}: MultipleProps) {
  const commonDef = model._def as unknown as (
    & Partial<ZodArrayDef<any>>
    & Partial<ZodTupleDef>
    & Partial<ZodSetDef>
    & Partial<ZodMapDef>
    & Partial<ZodRecordDef>
    & Partial<ZodObjectDef>
  ) & ZodTypeDef
  const dict = useMemo(() => {
    if (isWhatType(model, AllTypes.ZodObject)) {
      const dict = model.shape
      return Object.entries(dict)
        .reduce((acc, [key, s]) => {
          let ns = s
          if (s._def.label === undefined)
            ns = s.label(key)
          if (s._def.description === undefined)
            ns = s.describe(key)
          acc[key] = ns
          return acc
        }, {} as ZodRawShape)
    }
    if (isWhatType(model, AllTypes.ZodRecord)) {
      return Object
        .entries(props.value ?? props.defaultValue ?? {})
        .reduce((acc, [key]) => {
          acc[key] = model.valueSchema
          return acc
        }, {} as ZodRawShape)
    }
    return {}
  }, [model, props.defaultValue, props.value])
  const getSchema = useCallback((index?: number) => {
    if (isWhatType(model, AllTypes.ZodArray)) {
      return model._def.type
    }
    if (isWhatType(model, AllTypes.ZodTuple)) {
      return model._def.items[index as number]
    }
    if (
      isWhatType(model, AllTypes.ZodSet)
      || isWhatType(model, AllTypes.ZodRecord)
      || isWhatType(model, AllTypes.ZodMap)
    ) {
      return model._def.valueType
    }
    if (isWhatType(model, AllTypes.ZodObject)) {
      return Object.values(dict)[index as number]
    }
    return null
  // FIXME the next line
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dict,
    commonDef.items,
    commonDef.valueType,
    commonDef.typeName
  ])
  const schemasLength = useMemo(() => {
    if (isWhatTypes(model, [AllTypes.ZodArray, AllTypes.ZodSet])) {
      return Infinity
    }
    if (isWhatType(model, AllTypes.ZodTuple)) {
      return model._def.items.length
    }
    if (isWhatType(model, AllTypes.ZodObject)) {
      return Object.entries(model._def.shape() ?? {}).length
    }
    if (isWhatType(model, AllTypes.ZodRecord)) {
      return Object.entries(props.value ?? props.defaultValue ?? {}).length
    }
    return 0
  // FIXME the next line
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commonDef])

  const schemas = useMemo(() => {
    if (isWhatType(model, AllTypes.ZodTuple)) {
      return model._def.items
    }
    if (isWhatType(model, AllTypes.ZodObject)) {
      return Object.values(dict)
    }
    if (
      isWhatType(model, AllTypes.ZodSet)
      || isWhatType(model, AllTypes.ZodRecord)
      || isWhatType(model, AllTypes.ZodMap)
    ) {
      return Array.from({ length: schemasLength }).map((_, i) => getSchema(i))
    }
    return []
  // FIXME the next line
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dict, commonDef.typeName, commonDef.items, commonDef.valueType])

  const [_, setRigger] = useState(false)
  const initValue = useCallback(() => {
    const value = props.value ?? props.defaultValue
    if (Object.keys(dict).length > 0) {
      return Object
        .entries(dict)
        .map(([k, model]) => {
          const itemVal = value instanceof Map
            ? value.get(k)
            : !Array.isArray(value) && !(value instanceof Set)
              ? value?.[k]
              : undefined

          return itemVal ?? getDefaultValue(model)
        })
    } else {
      if (isWhatType(model, AllTypes.ZodTuple)) {
        return model._def.items.map(getDefaultValue)
      }
      if (value instanceof Set) {
        return Array.from(value)
      }
      if (Array.isArray(value)) {
        return value
      }
    }
    return []
  }, [dict, model, props.defaultValue, props.value])
  // TODO refactor to use state
  const listRef = useRef<any[]>(initValue())
  useEffect(() => {
    listRef.current = initValue().map((v, i) => {
      return v ?? listRef.current[i]
    })
    setRigger(r => !r)
  }, [schemas, initValue])

  const dictKeys = useMemo(() => Object.keys(dict ?? {}), [dict])
  const keysRef = useRef<string[]>([])

  const changeList = useCallback((value?: any[]) => {
    const keys = keysRef.current
    if (value !== undefined) {
      listRef.current = value
    }
    let v: any
    if (isWhatTypes(model, [AllTypes.ZodArray, AllTypes.ZodTuple, AllTypes.ZodSet])) {
      v = listRef.current
    } else {
      v = listRef.current.reduce((acc, v, i) => ({
        ...acc,
        [keys[i] ?? dictKeys[i] ?? i]: v
      }), {})
    }
    if (isWhatType(model, AllTypes.ZodMap)) {
      v = new Map(Object.entries(v))
    }
    onChange?.(v)
  }, [model, onChange, dictKeys])

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
  }, [changeList, getSchema])

  const isComplex = useMemo(() => ComplexMultipleTypes.includes(model._def.typeName), [model._def.typeName])

  const errorHandler = useErrorHandlerContext()
  const Unit = useCoreContextUnit('multiple', model._def.typeName, modes, { schemas })

  if (schemas.length === 0 && model._def.typeName === AllTypes.ZodTuple) {
    return errorHandler?.throwError(new Error('Tuple 类型必须包含一个元素'))
  }

  return Unit
    ? <Unit
        {...props}
        modes={modes}
        model={model}
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
        if (!itemSchema) return <Fragment key={index} />

        const isKeyEditable = KeyEditableTypes.includes(model._def.typeName)

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
                value={keysRef.current[index]}
                onChange={v => {
                  const keys = keysRef.current
                  const nKeys = keys.slice()
                  nKeys[index] = v.toString()
                  keysRef.current = nKeys
                  setRigger(r => !r)
                  changeList()
                }}
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
                icon='Prepend'
                onClick={() => addNewItem('prepend')}
              />
              : <Button
                shape='square'
                variant='outline'
                icon='ArrowUp'
                onClick={() => {
                  const temp = listRef.current[index]
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
                icon='Append'
                onClick={() => addNewItem('append')}
              />
              : <Button
                shape='square'
                variant='outline'
                icon='ArrowDown'
                onClick={() => {
                  const temp = listRef.current[index]
                  listRef.current[index] = listRef.current[index + 1]
                  listRef.current[index + 1] = temp
                  setRigger(r => !r)
                  changeList()
                }}
              />}
          </>}
          <Switcher
            disabled={props.disabled ?? false}
            className={`${prefix}-item__container`}
            model={itemSchema}
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
