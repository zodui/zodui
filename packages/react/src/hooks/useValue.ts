import { useCallback, useEffect, useRef, useState } from 'react'

export function useValue<T>(
  value: T, defaultValue: T, onChange?: (value: T) => void
) {
  const changeValue = useCallback((v: T) => {
    setValue(v)
    onChange?.(v)
  }, [onChange])
  const [vState, setValue] = useState(value ?? defaultValue)
  const isMounted = useRef(false)
  useEffect(() => {
    if (isMounted.current) {
      setValue(value)
    } else {
      isMounted.current = true
      const nv = value ?? defaultValue
      changeValue(nv)
    }
  }, [changeValue, defaultValue, value])
  return [vState, changeValue] as const
}
