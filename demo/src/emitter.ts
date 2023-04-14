export const createEmitter = <Args extends any[]>(): Emitter<Args> => {
  const cache = new Map<string, Args>()
  const changeListeners = new Map<string, ((...args: any[]) => void)[]>()

  const on = (...args: any[]) => {
    const [key, func] = args
    if (typeof key !== 'string' || typeof func !== 'function') {
      throw new Error('Key must be a string and func must be a function')
    }

    if (!changeListeners.has(key)) {
      changeListeners.set(key, [])
    }

    const listeners = changeListeners.get(key)!
    listeners.push(func)

    const prevRest = cache.get(key)
    prevRest && func(...prevRest)

    return () => {
      const index = listeners.indexOf(func)
      if (index !== -1) {
        listeners.splice(index, 1)
      }
    }
  }

  const emit = (...args: any[]) => {
    const [key, ...rest] = args
    if (typeof key !== 'string') {
      throw new Error('Key must be a string')
    }

    cache.set(key, rest as Args)
    const listeners = changeListeners.get(key)
    listeners?.forEach(func => func(...rest))
  }

  return {
    on,
    emit,
  }
}
