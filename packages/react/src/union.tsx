import z from 'zod'
import { useCallback, useMemo, useState } from 'react'
import { Select } from 'tdesign-react/esm'
import { Controller, ControllerProps } from './controller'
import { AllTypes, TypeMap, useModes } from './utils'

import './plugins/common-union'
import { plgMaster, UnionOptions } from './plugins'
import { useItemSerterContext } from './item-serter'
import { Schema } from './schema'

function resolveSchemaList(schemas: z.ZodUnionOptions): UnionOptions[] {
  // TODO resolve not literal type, it not contain value
  return schemas.map((schema, index) => ({
    label: schema._def.label || schema._def.description || schema._def.value,
    title: schema._def.description,
    value: index
  }))
}

export function Union({
  schema,
  ...rest
}: ControllerProps<TypeMap['ZodUnion']>) {
  const options = useMemo(() => resolveSchemaList(schema.options), [schema.options])
  const [index, setIndex] = useState<number>(0)
  const props = {
    title: schema._def.description,
    ...rest,
    onChange(v: any) {
      setIndex(v)
      rest.onChange?.(schema.options[v]._def.value)
    }
  }
  const modes = useModes(schema)

  const isSame = useMemo(() => {
    const first = schema.options[0]
    return schema.options.every(schema => schema._def.typeName === first._def.typeName)
  }, [schema.options])

  const ItemSerter = useItemSerterContext()

  const OptionRender = useCallback(() => <>
    <ItemSerter.Append deps={[schema.options, index]}>
      {/* 在里面控制是因为在 modes 修改后，将 append 内容清空 */}
      {modes.includes('append') && schema.options[index]._def.typeName !== AllTypes.ZodLiteral
        && <Schema model={schema.options[index]} />}
    </ItemSerter.Append>
    {!modes.includes('append') && schema.options[index]._def.typeName !== AllTypes.ZodLiteral && <>
      <br/>
      <Controller
        schema={schema.options[index]}
        {...rest}
      />
    </>}
  </>, [schema.options, index, modes, rest])

  const targetPlgs = plgMaster.plgs[schema._def.typeName]
  for (const { compMatchers } of targetPlgs) {
    for (const compMatcher of compMatchers) {
      if (compMatcher.is(modes))
        return <compMatcher.Component
          schema={schema}
          options={options}
          {...props}
        />
    }
  }

  return <>
    <Select
      options={options}
      {...props}
    />
    {!isSame && <OptionRender/>}
  </>
}
