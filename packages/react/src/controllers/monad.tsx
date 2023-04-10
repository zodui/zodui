import { ReactElement, useEffect, useState } from 'react'
import { ControllerProps } from './index'
import { TypeMap, AllTypes, Mutable } from '../utils'
import { Input, Switch } from '../components'

import '../plugins/common-monad'
import { plgMaster } from '../plugins'

declare module '@zodui/react' {
  export interface MonadSubController {
    props: {}
    options: {}
  }
  interface SubControllerMap {
    monad: MonadSubController
  }
}

const innerMonad = [
  AllTypes.ZodString,
  AllTypes.ZodNumber,
  AllTypes.ZodBoolean,
  AllTypes.ZodDate
] as const

export const monad = innerMonad as Mutable<typeof innerMonad>

export type MonadType = (typeof monad)[number]

export interface PrimitiveProps extends ControllerProps<TypeMap[MonadType]> {
}

export function Monad({
  modes,
  schema,
  ...rest
}: PrimitiveProps) {
  const [value, setValue] = useState(rest.defaultValue || rest.value)
  const props = {
    ...rest,
    value,
    onChange: (v: any) => {
      setValue(v)
      rest.onChange?.(v)
    }
  }
  useEffect(() => {
    setValue(rest.defaultValue || rest.value)
  }, [rest.defaultValue || rest.value])

  let InnerComp: ReactElement = null
  switch (schema._def.typeName) {
    case 'ZodNumber':
      InnerComp = <Input type='number' {...props} />
      break
    case 'ZodString':
      InnerComp = <Input {...props} />
      break
    case 'ZodDate':
      InnerComp = <Input {...props} />
      break
    case 'ZodBoolean':
      InnerComp = <Switch {...props} />
      break
  }

  const { Component } = plgMaster.reveal(schema._def.typeName, 'SubController.monad', [modes]) ?? {}
  return Component
    ? <Component modes={modes} {...props} />
    : InnerComp
}
