import { useEffect } from 'react'

export function useLifecycleChecker(tag: string) {
  console.log(`[useLifecycleChecker] ${tag} render`)
  useEffect(() => {
    console.log(`[useLifecycleChecker] ${tag} init`)
    return () => {
      console.log(`[useLifecycleChecker] ${tag} unmounted`)
    }
  }, [tag])
}
