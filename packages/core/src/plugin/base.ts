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

export interface ComposerRef<
  M extends ZodSchema = any,
  V = TypeOf<M>
> {
  /**
   * Reset the composer to the default value of the model and its properties.
   */
  reset: () => void
  /**
   * Verify the composer and return the value.
   */
  verify: () => Promise<V>
  watch: {
    (): V
    <K extends keyof V>(key: K): V[K]
    <K extends keyof V>(key: K, callback: (value: V[K]) => void): void
  }
  values: V
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
