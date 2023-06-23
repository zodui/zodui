import { getDefaultValue } from '@zodui/core/utils'
import { useMemo } from 'react'
import type { Schema } from 'zod'

export function useDefaultValue(s: Schema) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => getDefaultValue(s), [s._def])
}
