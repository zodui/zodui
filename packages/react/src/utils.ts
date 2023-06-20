import { getDefaultValue } from '@zodui/core/utils'
import { useEffect, useMemo } from 'react'
import type z from 'zod'

export function useDefaultValue(s: z.Schema) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => getDefaultValue(s), [s._def])
}

export function useLifecycleChecker(tag: string) {
  console.log(`[useLifecycleChecker] ${tag} render`)
  useEffect(() => {
    console.log(`[useLifecycleChecker] ${tag} init`)
    return () => {
      console.log(`[useLifecycleChecker] ${tag} unmounted`)
    }
  }, [tag])
}
