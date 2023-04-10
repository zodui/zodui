import './schema.scss'
import type { Schema as ZodSchema } from 'zod'

import { Item } from './item'
import { AllTypes, inlineMarkdown, isWhatType } from './utils'
import { plgMaster } from './plugins'
import common from './plugins/common'
import { useEffect } from 'react'

export interface SchemaProps {
  model: ZodSchema
  disabled?: boolean
}

const prefix = 'zodui-schema'

export function Schema(props: SchemaProps) {
  useEffect(() => {
    return plgMaster.register(common())
  }, [plgMaster, common])

  const {
    model,
    disabled
  } = props

  if (isWhatType(model, AllTypes.ZodIntersection)) {
    return <>
      <Schema disabled={disabled}
              model={model._def.left}
      />
      <Schema disabled={disabled}
              model={model._def.right}
      />
    </>
  }
  if (!isWhatType(model, AllTypes.ZodObject)) {
    return <Item
      label={model._label || model._def?.description || model.type}
      schema={model}
      disabled={disabled}
    />
  }

  return <div className={prefix}>
    <div className={`${prefix}__header`}>
      {props.model._def.label && <h2 className={`${prefix}__label`}>
        {props.model._def.label}
      </h2>}
      {props.model._def.description
        && <pre
          className={`${prefix}__desc inline-md`}
          dangerouslySetInnerHTML={{ __html: inlineMarkdown(props.model._def.description) }}
        />}
    </div>
    {Object.entries(model._def.shape()).map(([key, value]) => <Item
      key={key}
      label={value._def.label || key}
      schema={value}
      disabled={disabled}
    />)}
  </div>
}

Schema.Item = Item
