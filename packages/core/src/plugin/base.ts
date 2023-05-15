import type { AllType, ModesMap } from '@zodui/core'
import type { Schema as ZodSchema, TypeOf } from 'zod'

export interface SchemaResolver<
  M extends ZodSchema,
  V = TypeOf<M>
> {
  disabled?: boolean
  model: M
  value?: V
  defaultValue?: V
  onChange?: (value: V) => void | Promise<void>
}

export interface ComposerRef {
  verify: () => Promise<any>
}

export interface ComposerProps<M extends ZodSchema> extends SchemaResolver<M> {
  prefix?: string
}

export interface DescriptorRef {
  verify: () => Promise<any>
}

export interface DescriptorProps<M extends ZodSchema> extends SchemaResolver<M> {
  uKey?: string
  meta: {
    label: string
    description?: string
  }
}

export interface SwitcherProps<M extends ZodSchema> extends SchemaResolver<M> {
  uKey?: string
  modes?: string[]
}

export interface UnitProps<T extends AllType, M extends ZodSchema> extends SchemaResolver<M> {
  uKey?: string
  // @ts-ignore
  modes?: (ModesMap[T] | (string & {}))[]
}
