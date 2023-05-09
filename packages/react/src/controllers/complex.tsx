import './complex.scss'

import type { ComplexType, ComponentProps, TypeMap } from '@zodui/core'
import { AllTypes } from '@zodui/core'
import { isWhatType } from '@zodui/core/utils'
// TODO remove List import, and make Descriptors render target which can be customized
import { List, Select, useItemSerterContext } from '@zodui/react'
import type { ReactElement } from 'react'
import { useEffect, useMemo, useState } from 'react'
import type { ZodUnionOptions } from 'zod'

import { plgMaster } from '../plugins'
import type { ControllerProps } from './index'
import { Controller } from './index'

declare module '@zodui/react' {
  export interface ComplexSubController {
    props: {
      options: ComponentProps.SelectOptions[]
      OptionRender: ReactElement
    }
    options: {}
  }
  interface SubControllerMap {
    complex: ComplexSubController
  }
}

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
  uniqueKey, // FIXME
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
  }, [value, defaultValue, schema.options])
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
        && <List
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
