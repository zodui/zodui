import type { MonadType, TypeMap } from '@zodui/core'
import type { ReactElement } from 'react'

import { Input, Switch } from '../components'
import { useCoreContextUnit } from '../hooks/useCoreContextUnit'
import { useValue } from '../hooks/useValue'
import type { SwitcherPropsForReact } from './index'

export interface PrimitiveProps extends SwitcherPropsForReact<TypeMap[MonadType]> {
}

export function Monad({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  uKey, // FIXME
  modes,
  model,
  ...rest
}: PrimitiveProps) {
  const [value, changeValue] = useValue(rest.value, rest.defaultValue, rest.onChange)

  const props = {
    ...rest,
    value,
    onChange: changeValue
  }

  let InnerComp: ReactElement = null
  switch (model._def.typeName) {
    case 'ZodNumber':
      InnerComp = <Input type='number' {...props as any} />
      break
    case 'ZodString':
      InnerComp = <Input {...props as any} />
      break
    case 'ZodDate':
      // TODO better date input default ui
      InnerComp = <Input {...props as any} />
      break
    case 'ZodBoolean':
      InnerComp = <Switch {...props as any} />
      break
  }

  const Unit = useCoreContextUnit('monad', model._def.typeName, modes)
  return Unit
    ? <Unit modes={modes} model={model} {...props} />
    : InnerComp
}
