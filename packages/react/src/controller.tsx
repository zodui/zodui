import z, { ZodFirstPartyTypeKind } from 'zod'
import { Primitive, primitive } from './primitive'
import { isWhatType } from './utils'
import { Union } from './union'
import { List } from './list'
import React from 'react'

export interface ControllerProps {
  schema: z.Schema
  defaultValue?: any
  value?: any
  onChange?: (value: any) => void
  disabled?: boolean
  className?: string
}

export function Controller(props: ControllerProps) {
  return primitive.includes(props.schema.type)
    ? <Primitive {...props} />
    : isWhatType(props.schema, ZodFirstPartyTypeKind.ZodUnion)
    ? <Union {...props} />
    : ['array', 'tuple', 'record', 'dict', 'object'].includes(props.schema.type)
    ? <List {...props} />
    : <>暂未支持的的类型 <code>{props.schema.type}</code></>
}
