import './schema.scss'
import z, { ZodFirstPartyTypeKind } from 'zod'

import { Item } from './item'
import { isWhatType } from './utils'

export interface SchemaProps {
  model: z.Schema
  disabled?: boolean
}

const prefix = 'zodui-schema'

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

  // TODO resolve object lbale
  return <>
    <div className={`${prefix}__header`}>
      {props.model._def.label && <h3 className={`${prefix}__label`}>
        {props.model._def.label}
      </h3>}
      {props.model._def.description
        && <div className={`${prefix}__desc`}>{props.model._def.description}</div>}
    </div>
    {Object.entries(model._def.shape()).map(([key, value]) => <Item
      key={key}
      label={value._def.label || key}
      schema={value}
      disabled={disabled}
    />)}
  </>
}

Schema.Item = Item
