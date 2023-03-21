import z, { ZodFirstPartyTypeKind } from 'zod'

import { Item } from './item'
import { isWhatType } from './utils'

export interface SchemaProps {
  model: z.Schema
  disabled?: boolean
}

export function Schema(props: SchemaProps) {
  const {
    model,
    disabled
  } = props

  if (!isWhatType(model, ZodFirstPartyTypeKind.ZodObject)) {
    return <Item
      label={model._label || model._def.description || model.type}
      schema={model}
      disabled={disabled}
    />
  }
  return <>
    {Object.entries(model._def.shape()).map(([key, value]) => <Item
      key={key}
      label={value._def.label || key}
      schema={value}
      disabled={disabled}
    />)}
  </>
}

Schema.Item = Item
