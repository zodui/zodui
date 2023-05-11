import type { AllPaths, AsProps, ControllerPropsMap, InnerControllerPropsMap, RevealPropsByPath } from '@zodui/core'
import type { ReactElement } from 'react'
import { useEffect, useMemo } from 'react'

import type { ReactFramework } from '../components'
import { useCoreContextField, useErrorHandlerContext } from '../contexts'

export function Rndr<
  P extends AllPaths<ControllerPropsMap & ReactFramework['Controllers']>,
  InnerProps = RevealPropsByPath<
    P,
    InnerControllerPropsMap<ReactFramework['Controllers']>
  >,
  Props = InnerProps extends AsProps<infer P> ? P : never
>({
  target,
  ...props
}: {
  target: P | (string & {})
} & Props) {
  const errorHandler = useErrorHandlerContext()
  const Ctrl = useCoreContextField<(props: any) => ReactElement>(`framework.react.ctrls.${target.replace('.', ':')}`)

  const error = useMemo(() => {
    if (!Ctrl) {
      return new Error(`Controller ${target} not found`)
    }
    if (typeof Ctrl !== 'function') {
      return new Error(`Controller ${target} is not a function`)
    }
    return undefined
  }, [Ctrl, target])

  useEffect(() => {
    if (error === undefined && errorHandler.error !== undefined) {
      errorHandler.reset()
    }
  }, [error, errorHandler])

  if (error) {
    return errorHandler.throwError(error)
  }

  return <Ctrl {...props} />
}
