import type { TypeMap } from '@zodui/core'
import { Input, Switch } from '@zodui/react'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'

import type { MonadType } from '../configure'
import { plgMaster } from '../plugins'
import type { ControllerProps } from './index'

declare module '@zodui/react' {
  export interface MonadSubController {
    props: {}
    options: {}
  }
  interface SubControllerMap {
    monad: MonadSubController
  }
}

export interface PrimitiveProps extends ControllerProps<TypeMap[MonadType]> {
}

export function Monad({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  uniqueKey, // FIXME
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
  }, [rest.defaultValue, rest.value])

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
    ? <Component modes={modes} schema={schema} {...props} />
    : InnerComp
}
