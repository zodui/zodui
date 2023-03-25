import { Schema, ZodFirstPartyTypeKind } from 'zod'
import { Primitive, primitive } from './primitive'
import { isWhatType, useDefaultValue } from './utils'
import { Union } from './union'
import { List } from './list'

export interface ControllerProps<T extends Schema = Schema> {
  schema: T
  defaultValue?: any
  value?: any
  onChange?: (value: any) => void
  disabled?: boolean
  className?: string
}

export function Controller(props: ControllerProps) {
  const defaultValue = useDefaultValue(props.schema) ?? props.defaultValue
  if (isWhatType(props.schema, ZodFirstPartyTypeKind.ZodDefault)) {
    const {
      innerType,
      defaultValue: _,
      typeName: __,
      ...assignDefFields
    } = props.schema._def
    Object.assign(innerType._def, assignDefFields)
    return <Controller
      {...props}
      schema={innerType}
      defaultValue={defaultValue}
    />
  }
  return primitive.includes(props.schema.type)
    ? <Primitive {...props as any} />
    : isWhatType(props.schema, ZodFirstPartyTypeKind.ZodUnion)
    ? <Union {...props as any} />
    : ['array', 'tuple', 'record', 'dict', 'object'].includes(props.schema.type)
    ? <List {...props} />
    : <>暂未支持的的类型 <code>{props.schema.type}</code></>
}
