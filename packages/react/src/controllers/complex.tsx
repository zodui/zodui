import './complex.scss'

import type { ZodUnionOptions } from 'zod'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { Controller, ControllerProps } from './index'
import { AllTypes, TypeMap } from '@zodui/core'
import { isWhatType } from '@zodui/core/utils'

import { plgMaster } from '../plugins'
import { useItemSerterContext, Select, BaseCompProps } from '@zodui/react'
import { Schema } from '../schema'
import { ComplexType } from '../configure'

declare module '@zodui/react' {
  export interface ComplexSubController {
    props: {
      options: BaseCompProps.SelectOptions[]
      OptionRender: ReactElement
    }
    options: {}
  }
  interface SubControllerMap {
    complex: ComplexSubController
  }
}

function resolveSchemas(schemas: ZodUnionOptions): BaseCompProps.SelectOptions[] {
  // TODO resolve not literal type, it not contain value
  return schemas.map((schema, index) => ({
    label: schema._def.label || schema._def.description || schema._def.value || `${index}nd`,
    title: schema._def.description,
    value: index
  }))
}

export function Complex({
  uniqueKey,
  modes,
  schema,
  value,
  defaultValue,
  ...rest
}: ControllerProps<TypeMap[ComplexType]>) {
  const options = useMemo(() => resolveSchemas(schema.options), [schema.options])
  const [index, setIndex] = useState<number>(undefined)
  useEffect(() => {
    const v = value ?? defaultValue
    const index = schema.options
      .findIndex(option => isWhatType(option, AllTypes.ZodLiteral) && option._def.value === v)
    if (index === -1) return

    setIndex(index)
  }, [value, defaultValue])
  const props = {
    title: schema._def.description,
    ...rest,
    value: index,
    onChange(v: any) {
      setIndex(v)
      const option = schema.options[v]
      if (isWhatType(option, AllTypes.ZodLiteral)) {
        rest.onChange?.(option._def.value)
      } else {
        const dValue = option._def.defaultValue
        dValue && rest.onChange?.(dValue)
      }
    }
  }

  const ItemSerter = useItemSerterContext()

  const OptionRender = index ? <>
    <ItemSerter.Append deps={[schema.options, index]}>
      {/* 在里面控制是因为在 modes 修改后，将 append 内容清空 */}
      {modes.includes('append') && schema.options[index]._def.typeName !== AllTypes.ZodLiteral
        && <Schema
          model={schema.options[index]}
        />}
    </ItemSerter.Append>
    {!modes.includes('append') && schema.options[index]._def.typeName !== AllTypes.ZodLiteral && <>
      <Controller
        schema={schema.options[index]}
        {...props}
        onChange={rest.onChange}
      />
    </>}
  </> : null

  const { Component } = plgMaster.reveal(schema._def.typeName, 'SubController.complex', [modes]) ?? {}

  return Component
    ? <Component
      modes={modes}
      schema={schema}
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
