import z from 'zod'
import { useMemo } from 'react'
import { Select, RadioGroup } from 'tdesign-react/esm'
import { ControllerProps } from './controller'
import { WrapModes } from './configure'
import { useModes } from './utils'

WrapModes.push('radio-inline')

export interface UnionProps<T extends z.ZodUnionOptions> extends ControllerProps {
  schema: z.ZodUnion<T>
}

export interface Option {
  label: string
  title: string
  value: any
}

function resolveSchemaList(schemas: z.ZodUnionOptions): Option[] {
  return schemas.map(schema => ({
    label: schema._def.label || schema._def.description || schema._def.value,
    title: schema._def.description,
    value: schema._def.value,
  }))
}

export function Union<T extends z.ZodUnionOptions>({
  schema,
  ...rest
}: UnionProps<T>) {
  const options = useMemo(() => resolveSchemaList(schema.options), [schema.options])
  const props = {
    title: schema._def.description,
    ...rest
  }
  const modes = useModes(schema)
  switch (modes[0] ?? 'select') {
    case 'select':
      return <Select
        options={options}
        {...props}
      />
    case 'radio':
    case 'radio-inline':
      return <RadioGroup
        options={options}
        {...props}
      />
  }
  return <>
  </>
}
