import './multiple.v2.scss'

import type { TypeMap } from '@zodui/core'
import { useCallback, useMemo } from 'react'

import { Button } from '../components'
import { useValue } from '../hooks/useValue'
import type { SwitcherPropsForReact } from './index'

const prefix = 'multiple v2'

export function MultipleV2(props: SwitcherPropsForReact<TypeMap['ZodObject']>) {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    uKey, // FIXME
    modes,
    model,
    onChange,
    ...rest
  } = props
  const [list, changeValue] = useValue(
    rest.value,
    rest.defaultValue,
    useCallback((value: unknown | undefined) => {
      value && onChange?.(value)
    }, [onChange])
  )

  const list = useMemo(() => {
  }, [])
  console.log(rest.value, rest.defaultValue, list)
  return <>
  </>
}
