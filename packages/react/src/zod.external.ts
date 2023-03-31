import { ZodDefaultDef, ZodFirstPartyTypeKind, ZodType, ZodTypeAny } from 'zod'
import { AllTypes } from './utils'

export interface ModesMap extends Record<AllTypes, string> {
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
    | 'date'
    | 'time'
    | 'panel'
  [ZodFirstPartyTypeKind.ZodUnion]:
    | 'append'
    | 'radio'
    | 'radio-inline'
    | 'button'
  [ZodFirstPartyTypeKind.ZodTuple]:
    | 'range'
    | 'slider'
    | 'no-range'
    | 'no-slider'
    | 'datetime'
    | 'date'
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
          // @ts-ignore
          : ModesMap[Def['typeName']]
        | (string & {})
    ): ZodType<Output, Def, Input>

    readonly _label: string
    label(mode: string): ZodType<Output, Def, Input>

    readonly type: string
  }
  // export function clazz<T>(clazz: { new(): T }): Schema<T>
  // export function asObejct<T extends any>(t: T): ZodObject<Record<string, ZodTypeAny> & T>
}

// function addExport(key: string, declare: any) {
//   try {
//     // let z enable to define
//     !Object.hasOwn(z, key)
//       && Object.defineProperty(z, key, {
//         get() {
//           return declare
//         }
//       })
//   } catch (e) {
//     console.error(e)
//   }
// }
//
// addExport('clazz', (clazz: { new(): any }) => {
//   return z.object(new clazz())
// })

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
