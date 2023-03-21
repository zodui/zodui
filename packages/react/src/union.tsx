import z from 'zod'
import { useMemo } from 'react'
import { Select, RadioGroup } from 'tdesign-react/esm'
import { ControllerProps } from './controller'
import { NeedWrapModes } from './configure'
import { Primitive } from './primitive'
import { useModes } from './utils'

NeedWrapModes.push('radio-inline')

export interface UnionProps extends ControllerProps {
}

export interface Option {
  label: string
  title: string
  value: any
}

function resolveSchemaList(schemas: z.Schema[]): Option[] {
  return schemas.map(schema => ({
    label: schema._def.label || schema._def.description,
    title: schema._def.description,
    value: schema._def,
  }))
}

export const ISNOT_DATETIME_UNION = Symbol('ISNOT_DATETIME_UNION')

export function isDatetimeUnion(schema: z.Schema) {
  if (schema.list.length === 2) {
    const [s0, s1] = schema.list
    if (s0.type === 'is' && s1.type === 'transform') {
      let original = s1.inner
      original = original.mode(
        original.meta.mode + (schema.meta.mode ? ` ${schema.meta.mode}` : '')
      )
      return original
    }
  }
  throw ISNOT_DATETIME_UNION
}

export function Union({
  schema,
  ...rest
}: UnionProps) {
  try {
    return <Primitive schema={isDatetimeUnion(schema)} {...rest}/>
  } catch (e) {
    if (e !== ISNOT_DATETIME_UNION)
      return <>{e.toString()}</>
  }
  const options = useMemo(() => resolveSchemaList(schema.list), [schema.list])
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
