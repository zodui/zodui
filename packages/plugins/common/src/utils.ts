import type { AllTypes } from '@zodui/core'
import type { Schema } from 'zod'

export function isEqual(schemas: Schema[], types: AllTypes[]) {
  return schemas.length === types.length && schemas.every(
    (s, i) => (s._def as any)
      .typeName === types[i]
  )
}
