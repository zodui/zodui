import './index.scss'

import type { AllType, TypeMap } from '@zodui/core'
import {
  AllTypes
} from '@zodui/core'
import { complex, monad, multiple } from '@zodui/core'
import {
  isWhatType,
  isWhatTypes
} from '@zodui/core/utils'
import type { ReactElement } from 'react'
import { useCallback } from 'react'
import type { Schema, ZodTypeDef } from 'zod'
import type z from 'zod'

import { useControllerClassName } from '../contexts'
import {
  useDefaultValue,
  useModes
} from '../utils'
import { Complex } from './complex'
import { Monad } from './monad'
import { Multiple } from './multiple'

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
    (props: SwitcherProps<any>) => ReactElement
  ]
): tuple is [TypeMap[T], (props: SwitcherProps<TypeMap[T]>) => ReactElement] {
  const [s] = tuple
  return isWhatTypes(s, types)
}

export interface SwitcherProps<T extends Schema = Schema> {
  uniqueKey?: string
  modes?: string[]
  schema: T
  defaultValue?: any
  value?: any
  onChange?: (value: any) => void
  disabled?: boolean
  className?: string
}

/**
 * Switcher will try to resolve all schema and render it
 */
export function Switcher(props: SwitcherProps) {
  const { schema, ...rest } = props
  const { className: subClassName, ControllerClassName } = useControllerClassName()
  // props defaultValue is higher than schema defaultValue
  // because Component is user controlled
  // but schema defaultValue is not user controlled, so we should use props defaultValue first
  const innerDefaultValue = useDefaultValue(schema)
  const defaultValue = props.defaultValue ?? innerDefaultValue

  // TODO resolve parent modes?
  const modes = useModes(schema)

  const InnerSwitcher: () => ReactElement = useCallback(() => {
    for (const [name, types, InnerSwitcher] of switchers) {
      // let ts happy
      const checkTuple = [schema, InnerSwitcher] as const
      if (isWhatTypesSwitcherMatcher(types, checkTuple)) {
        const [schema, InnerSwitcher] = checkTuple
        return <div className={`zodui-controller ${name} ${schema.type} ${subClassName}`}>
          <ControllerClassName>
            <InnerSwitcher schema={schema} modes={modes} {...rest} />
          </ControllerClassName>
        </div>
      }
    }
    return null
  }, [schema, subClassName, ControllerClassName, modes, rest])

  if (isWhatType(schema, AllTypes.ZodDefault)) {
    const {
      innerType,
      defaultValue: _,
      typeName: __,
      ...assignDefFields
    } = schema._def
    Object.assign(innerType._def, assignDefFields)
    return <Switcher
      {...props}
      schema={innerType}
      defaultValue={defaultValue}
    />
  }
  if (isWhatType(schema, AllTypes.ZodOptional)) {
    const {
      innerType,
      typeName: __,
      ...assignDefFields
    } = schema._def
    Object.assign(innerType._def, assignDefFields)
    return <Switcher
      {...props}
      schema={innerType}
    />
  }

  return InnerSwitcher
    ? <InnerSwitcher />
    : <div className='zodui-controller'>
      <span style={{ width: '100%' }}>暂未支持的的类型 <code>{schema.type}</code></span>
    </div>
}
