import { useEffect, useState } from 'react'
import { ControllerProps } from './index'
import { useModes, TypeMap, AllTypes, Mutable } from '../utils'
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
  const modes = useModes(schema)

  // const ctrlArr = plgMaster.reveal('SubController.monad')
  // const { Component } = ctrlArr.find(({ is }) => is(modes)) ?? {}
  // if (Component)
  //   return <Component modes={modes} {...props}>
  //     {defaultSlot}
  //   </Component>

  const targetPlgs = plgMaster.plgs[schema._def.typeName]
  for (const { componentMatchers } of targetPlgs) {
    for (const compMatcher of componentMatchers) {
      if (compMatcher.is(modes))
        return <compMatcher.Component modes={modes} schema={schema} {...props} />
    }
  }
  switch (schema._def.typeName) {
    case 'ZodNumber':
      return <Input type='number' {...props} />
    case 'ZodString':
      return <Input {...props} />
    case 'ZodDate':
      return <Input {...props} />
    case 'ZodBoolean':
      return <Switch {...props} />
  }
  return <></>
}
