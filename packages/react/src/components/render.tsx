import type { AllPaths, AsProps, InnerRenderPropsMap, RenderPropsMap, RevealPropsByPath } from '@zodui/core'
import type { ReactElement } from 'react'
import { useEffect, useMemo } from 'react'

import type { ReactFramework } from '../components'
import { useCoreContextField, useErrorHandlerContext } from '../contexts'

export function Rndr<
  P extends AllPaths<RenderPropsMap & ReactFramework['Renders']>,
  InnerProps = RevealPropsByPath<
    P,
    InnerRenderPropsMap<ReactFramework['Renders']>
  >,
  Props = InnerProps extends AsProps<infer P> ? P : never
>({
  target,
  ...props
}: {
  target: P | (string & {})
} & Props) {
  const errorHandler = useErrorHandlerContext()
  const Ctrl = useCoreContextField<(props: any) => ReactElement>(`framework.react.rndrs.${target.replace('.', ':')}`)

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
    if (error === undefined && errorHandler && errorHandler.error !== undefined) {
      errorHandler.reset()
    }
  }, [error, errorHandler])

  if (error) {
    return errorHandler?.throwError(error)
  }

  return <Ctrl {...props} />
}
