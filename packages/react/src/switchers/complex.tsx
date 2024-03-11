import './complex.scss'

import type { ComplexType, ComponentProps, TypeMap } from '@zodui/core'
import { AllTypes } from '@zodui/core'
import { flatUnwrapUnion, isWhatType } from '@zodui/core/utils'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ZodAny, ZodLiteral, ZodUnion } from 'zod'
import type { ZodTypeAny, ZodUnionOptions } from 'zod'

import { Select } from '../components'
// TODO remove List import, and make Descriptors render target which can be customized
import { List } from '../composers'
import { useItemSerterContext } from '../contexts'
import { useCoreContextUnit } from '../hooks/useCoreContextUnit'
import { useValue } from '../hooks/useValue'
import type { SwitcherPropsForReact } from './index'
import { Switcher } from './index'

function resolveSchemas(schemas: ZodUnionOptions): ComponentProps.Option[] {
  // TODO resolve not literal type, it not contain value
  return schemas.map((schema, index) => ({
    label: schema._def.label ?? schema._def.description ?? JSON.stringify(schema._def.value) ?? `${index}nd`,
    title: schema._def.description,
    value: index
  }))
}

export function Complex({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  uKey, // FIXME
  modes,
  model,
  value: _value,
  defaultValue,
  ...rest
}: SwitcherPropsForReact<TypeMap[ComplexType]>) {
  const [value, changeValue] = useValue(_value, defaultValue, rest.onChange)
  const [index, setIndex] = useState<number>(undefined)
  const modelOptions = useMemo(() => {
    if (isWhatType(model, AllTypes.ZodUnion)) {
      return flatUnwrapUnion(model)
    }
    if (isWhatType(model, AllTypes.ZodDiscriminatedUnion)) {
      return model.options
    }
    throw new Error('model is not union or discriminated union')
  }, [model])
  const changeIndex = useCallback((v: number) => {
    setIndex(v)
    const optionModel = modelOptions[v]
    if (isWhatType(optionModel, AllTypes.ZodLiteral)) {
      changeValue?.(optionModel._def.value)
    }
  }, [modelOptions, changeValue])
  const dependKeys = useMemo(() => {
    if (isWhatType(model, AllTypes.ZodDiscriminatedUnion))
      return [model.discriminator]
    return []
  }, [model])
  const dependValues = useMemo(() => {
    return dependKeys.map(key => value?.[key])
  }, [dependKeys, value])
  const dependKeysOptions = useMemo(() => {
    const map = new Map<string, ZodTypeAny[]>()
    modelOptions.forEach((option: ZodTypeAny) => {
      if (isWhatType(option, AllTypes.ZodObject)) {
        dependKeys.forEach(key => {
          if (option.shape[key]) {
            if (!map.has(key)) map.set(key, [])
            map
              .get(key)
              .push(option.shape[key])
          }
        })
      }
    })
    return map
  }, [dependKeys, modelOptions])
  const options = useMemo(() => resolveSchemas(modelOptions), [modelOptions])
  const activeOption = useMemo(() => {
    if (isWhatType(model, AllTypes.ZodDiscriminatedUnion)) {
      const key = model.discriminator
      const dependKeyOptions = dependKeysOptions.get(key)
      const keyIndex = dependKeys.findIndex(k => k === key)
      if (!dependKeyOptions) return
      const literals = dependKeyOptions.reduce((prev, curr) => prev.or(curr))
      let index = 0
      for (let i = 0; i < dependKeyOptions.length; i++) {
        const literal = dependKeyOptions[i]
        if (literal._def.value === dependValues[keyIndex]) {
          index = i
          break
        }
      }

      const template = modelOptions[index]
      if (isWhatType(template, AllTypes.ZodObject)) {
        return template.setKey(key, literals.label(
          // FIXME remove type assert
          (literals as ZodUnion<[ZodLiteral<any>, ...ZodLiteral<any>[]]>).options[index]._def.label
        ))
      }
      return
    }

    const option = modelOptions[index] as ZodTypeAny | undefined
    if (index === undefined) return
    if (index < 0 || index >= modelOptions.length) {
      setIndex(undefined)
      return
    }
    return option
  }, [dependKeys, dependKeysOptions, dependValues, index, model])
  useEffect(() => {
    const v = value
    let index = -1
    if (isWhatType(model, AllTypes.ZodUnion)) {
      index = modelOptions
        .findIndex((option: ZodAny) => isWhatType(option, AllTypes.ZodLiteral) && option._def.value === v)
    }
    if (isWhatType(model, AllTypes.ZodDiscriminatedUnion)) {
      // console.log(model, modelOptions)
      // TODO support calc index when model has default value or value
    }
    if (index === -1) return

    setIndex(index)
  }, [value, modelOptions, model])

  const ItemSerter = useItemSerterContext()

  const OptionsRender = activeOption && <>
    <ItemSerter.Append deps={[
      modes,
      modelOptions, activeOption, changeValue
    ]}>
      {/* 在里面控制是因为在 modes 修改后，将 append 内容清空 */}
      {modes.includes('append') && activeOption._def.typeName !== AllTypes.ZodLiteral
        && <List
          model={activeOption}
          onChange={changeValue}
        />}
    </ItemSerter.Append>
    {!modes.includes('append') && activeOption._def.typeName !== AllTypes.ZodLiteral && <>
      <Switcher
        model={activeOption}
        onChange={changeValue}
      />
    </>}
  </>

  const Unit = useCoreContextUnit('complex', model._def.typeName, modes, { model })

  return Unit
    ? <Unit
      modes={modes}
      model={model}
      options={options}
      OptionRender={OptionsRender}
      {...rest}
      value={value}
      defaultValue={defaultValue}
      onChange={changeValue}
    />
    // TODO support `'' | (string & {})` type and `0 | (number & {})` type
    //      display select input
    : <>
      {isWhatType(model, AllTypes.ZodUnion) && <>
        <Select
          options={options}
          value={index}
          onChange={changeIndex}
        />
        {OptionsRender}
      </>}
      {isWhatType(model, AllTypes.ZodDiscriminatedUnion) && <>
        {OptionsRender}
      </>}
    </>
}
