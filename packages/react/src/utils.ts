import z from 'zod'
import { useEffect, useMemo } from 'react'
import { getDefaultValue, getModes } from '@zodui/core/utils'

export function useModes<T extends z.ZodTypeAny>(schema: T) {
  return useMemo(() => getModes(schema._mode), [schema._mode])
}

export function useDefaultValue(s: z.Schema) {
  return useMemo(() => getDefaultValue(s), [s._def])
}

export function useLifecycleChecker(tag: string) {
  console.log(`[useLifecycleChecker] ${tag} render`)
  useEffect(() => {
    console.log(`[useLifecycleChecker] ${tag} init`)
    return () => {
      console.log(`[useLifecycleChecker] ${tag} unmounted`)
    }
  }, [])
}
