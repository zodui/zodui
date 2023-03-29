import type { Schema as ZodSchema } from 'zod'

import { Item } from './item'
import { AllTypes, isWhatType } from './utils'

export interface SchemaProps {
  model: ZodSchema
  disabled?: boolean
}

export function Schema(props: SchemaProps) {
  const {
    model,
    disabled
  } = props

  if (!isWhatType(model, AllTypes.ZodObject)) {
    return <Item
      label={model._label || model._def.description || model.type}
      schema={model}
      disabled={disabled}
    />
  }

  // TODO resolve object lbale
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
