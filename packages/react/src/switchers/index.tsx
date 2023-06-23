import './index.scss'

import type { AllType, SwitcherProps, TypeMap } from '@zodui/core'
import {
  AllTypes,
  complex,
  monad,
  multiple
} from '@zodui/core'
import {
  classnames,
  isWhatType,
  isWhatTypes
} from '@zodui/core/utils'
import type { ReactElement } from 'react'
import { useMemo } from 'react'
import type { ZodTypeDef } from 'zod'
import type z from 'zod'
import type { Schema as ZodSchema } from 'zod/lib/types'

import { useControllerClassName } from '../contexts'
import { useDefaultValue } from '../hooks/useDefaultValue'
import {
  useModes
} from '../hooks/useModes'
import type { StyledProps } from '../type'
import { Complex } from './complex'
import { Monad } from './monad'
import { Multiple } from './multiple'

declare module '@zodui/core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface UnitFrameworksComp<N, Props> {
    react: (props: Props & StyledProps) => ReactElement
  }
}

// TODO support literal type display
const switchers = [
  ['monad', monad, Monad],
  ['complex', complex, Complex],
  ['multiple', multiple, Multiple]
] as const

function isWhatTypesSwitcherMatcher<T extends AllType>(
  types: T[],
  tuple: readonly [
    z.Schema<any, ZodTypeDef & {
      typeName?: AllType
    }, any>,
    (props: SwitcherPropsForReact<any>) => ReactElement
  ]
): tuple is [TypeMap[T], (props: SwitcherPropsForReact<TypeMap[T]>) => ReactElement] {
  return isWhatTypes(tuple[0], types)
}

export interface SwitcherPropsForReact<M extends ZodSchema> extends SwitcherProps<M> {
  className?: string
}

/**
 * Switcher will try to resolve all schema and render it
 */
export function Switcher<M extends ZodSchema>(props: SwitcherPropsForReact<M>) {
  const { model, ...rest } = props
  const { className: subClassName, ControllerClassName } = useControllerClassName()
  // props defaultValue is higher than schema defaultValue
  // because Component is user controlled
  // but schema defaultValue is not user controlled, so we should use props defaultValue first
  const innerDefaultValue = useDefaultValue(model)
  const defaultValue = props.defaultValue ?? innerDefaultValue

  // TODO resolve parent modes?
  const modes = useModes(model)

  const [name, InnerSwitcher = null] = useMemo(() => {
    for (const [name, types, InnerSwitcher] of switchers) {
      // let ts happy
      const checkTuple = [model, InnerSwitcher] as const
      if (isWhatTypesSwitcherMatcher(types, checkTuple)) {
        const [schema, InnerSwitcher] = checkTuple
        // eslint-disable-next-line react/jsx-key
        return [name, <InnerSwitcher model={schema} modes={modes} {...rest} />] as const
      }
    }
    return []
  }, [model, modes, rest])

  if (isWhatType(model, AllTypes.ZodDefault)) {
    const {
      innerType,
      defaultValue: _,
      typeName: __,
      ...assignDefFields
    } = model._def
    Object.assign(innerType._def, assignDefFields)
    return <Switcher
      {...props}
      model={innerType}
      defaultValue={defaultValue}
    />
  }
  if (isWhatType(model, AllTypes.ZodOptional)) {
    const {
      innerType,
      typeName: __,
      ...assignDefFields
    } = model._def
    Object.assign(innerType._def, assignDefFields)
    return <Switcher
      {...props}
      model={innerType}
    />
  }

  return <div className={classnames(
    'zodui-controller',
    ...(InnerSwitcher ? [
      name,
      model.type,
      subClassName
    ] : [])
  )}>
    <ControllerClassName>
      {InnerSwitcher
        ? InnerSwitcher
        : <span style={{ width: '100%' }}>暂未支持的的类型 <code>{model.type}</code></span>}
    </ControllerClassName>
  </div>
}
