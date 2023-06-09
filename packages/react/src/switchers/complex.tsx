import './complex.scss'

import type { ComplexType, ComponentProps, TypeMap } from '@zodui/core'
import { AllTypes } from '@zodui/core'
import { isWhatType } from '@zodui/core/utils'
import { useEffect, useMemo, useState } from 'react'
import type { ZodUnionOptions } from 'zod'

import { Select } from '../components'
// TODO remove List import, and make Descriptors render target which can be customized
import { List } from '../composers'
import { useItemSerterContext } from '../contexts'
import { useCoreContextUnit } from '../hooks'
import type { SwitcherPropsForReact } from './index'
import { Switcher } from './index'

function resolveSchemas(schemas: ZodUnionOptions): ComponentProps.SelectOptions[] {
  // TODO resolve not literal type, it not contain value
  return schemas.map((schema, index) => ({
    label: schema._def.label || schema._def.description || schema._def.value || `${index}nd`,
    title: schema._def.description,
    value: index
  }))
}

export function Complex({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  uKey, // FIXME
  modes,
  model,
  value,
  defaultValue,
  ...rest
}: SwitcherPropsForReact<TypeMap[ComplexType]>) {
  const options = useMemo(() => resolveSchemas(model.options), [model.options])
  const [index, setIndex] = useState<number>(undefined)
  useEffect(() => {
    const v = value ?? defaultValue
    const index = model.options
      .findIndex(option => isWhatType(option, AllTypes.ZodLiteral) && option._def.value === v)
    if (index === -1) return

    setIndex(index)
  }, [value, defaultValue, model.options])
  const props = {
    title: model._def.description,
    ...rest,
    value: index,
    onChange(v: any) {
      setIndex(v)
      const option = model.options[v]
      if (isWhatType(option, AllTypes.ZodLiteral)) {
        rest.onChange?.(option._def.value)
      } else {
        const dValue = option._def.defaultValue
        dValue && rest.onChange?.(dValue)
      }
    }
  }

  const ItemSerter = useItemSerterContext()

  const OptionRender = index !== undefined ? <>
    <ItemSerter.Append deps={[model.options, index]}>
      {/* 在里面控制是因为在 modes 修改后，将 append 内容清空 */}
      {modes.includes('append') && model.options[index]._def.typeName !== AllTypes.ZodLiteral
        && <List
          model={model.options[index]}
        />}
    </ItemSerter.Append>
    {!modes.includes('append') && model.options[index]._def.typeName !== AllTypes.ZodLiteral && <>
      <Switcher
        model={model.options[index]}
        {...props}
        onChange={rest.onChange}
      />
    </>}
  </> : null

  const Unit = useCoreContextUnit('complex', model._def.typeName, modes)

  return Unit
    ? <Unit
      modes={modes}
      model={model}
      options={options}
      OptionRender={OptionRender}
      {...props}
    />
    // TODO support `'' | (string & {})` type
    //      display select input
    : <>
      <Select
        options={options}
        {...props}
      />
      {OptionRender}
    </>
}
