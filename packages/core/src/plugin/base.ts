import type { Schema as ZodSchema, TypeOf } from 'zod'

export interface SchemaResolver<
  M extends ZodSchema,
  V = TypeOf<M>
> {
  disabled?: boolean
  model: ZodSchema
  value?: V
  defaultValue?: V
  onChange?: (value: V) => void | Promise<void>
}

export interface Composer<M extends ZodSchema> extends SchemaResolver<M> {
  prefix?: string
}

export interface Descriptor<M extends ZodSchema> extends SchemaResolver<M> {
  uKey?: string
  meta: {
    label: string
    description?: string
  }
}

export interface Switcher<M extends ZodSchema> extends SchemaResolver<M> {
  uKey?: string
  modes?: string[]
}

export interface Unit<M extends ZodSchema> extends SchemaResolver<M> {
  uKey?: string
}
