import z from 'zod'
import { useMemo } from 'react'
import { Select } from 'tdesign-react/esm'
import { ControllerProps } from './controller'
import { TypeMap, useModes } from './utils'

import './plugins/common-union'
import { plgMaster, UnionOptions } from './plugins'

function resolveSchemaList(schemas: z.ZodUnionOptions): UnionOptions[] {
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
  const props = {
    title: schema._def.description,
    ...rest,
    onChange(v: any) {
      rest.onChange?.(schema.options[v]._def.value)
    }
  }
  const modes = useModes(schema)

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
  return <Select
    options={options}
    {...props}
  />
}
