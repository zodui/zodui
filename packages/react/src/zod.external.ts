import { ZodDefaultDef, ZodFirstPartyTypeKind, ZodType, ZodTypeAny } from 'zod'

export interface ModesMap {
  [ZodFirstPartyTypeKind.ZodNumber]:
    | 'slider'
    | 'rate'
  [ZodFirstPartyTypeKind.ZodString]:
    | 'textarea'
    | 'link'
    | 'secrets'
    | 'date'
    | 'datetime'
    | 'time'
    | 'panel'
  [ZodFirstPartyTypeKind.ZodBoolean]:
    | 'checkbox'
  [ZodFirstPartyTypeKind.ZodDate]:
    | 'datetime'
    | 'time'
    | 'panel'
  [ZodFirstPartyTypeKind.ZodTuple]:
    | 'range'
    | 'slider'
    | 'no-range'
    | 'no-slider'
    | 'datetime'
    | 'time'
    | 'panel'
}

declare module 'zod' {
  export interface ZodTypeDef {
    mode: string
    label: string
  }
  export interface ZodType<Output = any, Def extends ZodTypeDef = ZodTypeDef, Input = Output> {
    readonly _mode: string
    mode<T extends string>(
      mode:
        | Def extends ZodDefaultDef<infer InnerT extends ZodTypeAny>
          ? ModesMap[InnerT['_def']['typeName']]
          : ModesMap[Def['typeName']]
        | (string & {})
    ): ZodType<Output, Def, Input>

    readonly _label: string
    label(mode: string): ZodType<Output, Def, Input>

    readonly type: string
  }
}

function defineMetaField(key: string) {
  try {
    !Object.hasOwn(ZodType.prototype, `_${key}`)
      && Object.defineProperty(ZodType.prototype, `_${key}`, {
        get() {
          return this._def[key]
        }
      })
    !Object.hasOwn(ZodType.prototype, key)
      && Object.defineProperty(ZodType.prototype, key, {
        get() {
          return (val: any) => {
            const This = (this as any).constructor;
            return new This({
              ...this._def,
              [key]: val,
            });
          }
        }
      })
  } catch (e) {
    console.error(e)
  }
}

defineMetaField('mode')
defineMetaField('label')

!Object.hasOwn(ZodType.prototype, 'type')
  && Object.defineProperty(ZodType.prototype, 'type', {
    get() {
      return this._def
        ?.typeName
        .replace('Zod', '')
        .toLowerCase()
        ?? 'unkonwn'
    }
  })
