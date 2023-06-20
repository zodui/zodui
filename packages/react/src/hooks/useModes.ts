import { getModes } from '@zodui/core/utils'
import { useMemo } from 'react'
import type { ZodTypeAny } from 'zod'

export function useModes<T extends ZodTypeAny>(schema: T) {
  return useMemo(() => getModes(schema._mode), [schema._mode])
}
