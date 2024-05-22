import type { RecordType, ZodRawShape, ZodUnionOptions } from 'zod'
import type z from 'zod'
import { ZodFirstPartyTypeKind } from 'zod'
import { EnumLike, number, string, ZodDiscriminatedUnionOption, ZodTuple, ZodTypeAny } from 'zod/lib/types'

type IsEqual<A, B> = (
  <T>() => T extends A ? 1 : 2
) extends (
  <T>() => T extends B ? 1 : 2
) ? true : false

export interface ZodTypeMap<
  /* eslint-disable @typescript-eslint/no-unnecessary-type-constraint, @typescript-eslint/no-unused-vars */
  A extends any = any,
  B extends any = any,
  C extends any = any,
  D extends any = any,
  E extends any = any
  /* eslint-enable @typescript-eslint/no-unnecessary-type-constraint, @typescript-eslint/no-unused-vars */
> {
  ZodString: z.ZodString
  ZodNumber: z.ZodNumber
  ZodNaN: z.ZodNaN
  ZodBigInt: z.ZodBigInt
  ZodBoolean: z.ZodBoolean
  ZodDate: z.ZodDate
  ZodSymbol: z.ZodSymbol
  ZodUndefined: z.ZodUndefined
  ZodNull: z.ZodNull
  ZodAny: z.ZodAny
  ZodUnknown: z.ZodUnknown
  ZodNever: z.ZodNever
  ZodVoid: z.ZodVoid
  // FIXME
  ZodArray: z.ZodArray<A & ZodTypeAny>
  ZodObject: z.ZodObject<
    IsEqual<A, any> extends true
      ? ZodRawShape
      : A & ZodRawShape
  >
  ZodUnion: z.ZodUnion<ZodUnionOptions>
  ZodDiscriminatedUnion: z.ZodDiscriminatedUnion<A & string, ZodDiscriminatedUnionOption<A & string>[]>
  ZodIntersection: z.ZodIntersection<A & ZodTypeAny, B & ZodTypeAny>
  ZodTuple: z.ZodTuple
  ZodRecord: z.ZodRecord
  ZodMap: z.ZodMap
  ZodSet: z.ZodSet
  ZodFunction: z.ZodFunction<A & ZodTuple<any, any>, B & ZodTypeAny>
  ZodLazy: z.ZodLazy<A & ZodTypeAny>
  ZodLiteral: z.ZodLiteral<A>
  ZodEnum: z.ZodEnum<A & [string, ...string[]]>
  ZodEffects: z.ZodEffects<A & ZodTypeAny>
  ZodNativeEnum: z.ZodNativeEnum<A & EnumLike>
  ZodOptional: z.ZodOptional<A & ZodTypeAny>
  ZodNullable: z.ZodNullable<A & ZodTypeAny>
  ZodDefault: z.ZodDefault<A & ZodTypeAny>
  ZodCatch: z.ZodCatch<A & ZodTypeAny>
  ZodPromise: z.ZodPromise<A & ZodTypeAny>
  ZodBranded: z.ZodBranded<A & ZodTypeAny, B & (string | number | symbol)>
  ZodPipeline: z.ZodPipeline<A & ZodTypeAny, B & ZodTypeAny>
}

export interface ZodTypeDefMap<
  /* eslint-disable @typescript-eslint/no-unnecessary-type-constraint, @typescript-eslint/no-unused-vars */
  A extends any = any,
  B extends any = any,
  C extends any = any,
  D extends any = any,
  E extends any = any
  /* eslint-enable @typescript-eslint/no-unnecessary-type-constraint, @typescript-eslint/no-unused-vars */
> {
  ZodString: z.ZodStringDef
  ZodNumber: z.ZodNumberDef
  ZodNaN: z.ZodNaNDef
  ZodBigInt: z.ZodBigIntDef
  ZodBoolean: z.ZodBooleanDef
  ZodDate: z.ZodDateDef
  ZodSymbol: z.ZodSymbolDef
  ZodUndefined: z.ZodUndefinedDef
  ZodNull: z.ZodNullDef
  ZodAny: z.ZodAnyDef
  ZodUnknown: z.ZodUnknownDef
  ZodNever: z.ZodNeverDef
  ZodVoid: z.ZodVoidDef
  ZodArray: z.ZodArrayDef
  ZodObject: z.ZodObjectDef
  ZodUnion: z.ZodUnionDef
  ZodDiscriminatedUnion: z.ZodDiscriminatedUnionDef<A & string>
  ZodIntersection: z.ZodIntersectionDef
  ZodTuple: z.ZodTupleDef
  ZodRecord: z.ZodRecordDef
  ZodMap: z.ZodMapDef
  ZodSet: z.ZodSetDef
  ZodFunction: z.ZodFunctionDef
  ZodLazy: z.ZodLazyDef
  ZodLiteral: z.ZodLiteralDef
  ZodEnum: z.ZodEnumDef
  ZodEffects: z.ZodEffectsDef
  ZodNativeEnum: z.ZodNativeEnumDef
  ZodOptional: z.ZodOptionalDef
  ZodNullable: z.ZodNullableDef
  ZodDefault: z.ZodDefaultDef
  ZodCatch: z.ZodCatchDef
  ZodPromise: z.ZodPromiseDef
  ZodBranded: z.ZodBrandedDef<A & ZodTypeAny>
  ZodPipeline: z.ZodPipelineDef<A & ZodTypeAny, B & ZodTypeAny>
}

export interface TypeMap<
  /* eslint-disable @typescript-eslint/no-unnecessary-type-constraint, @typescript-eslint/no-unused-vars */
  A extends any = any,
  B extends any = any,
  C extends any = any,
  D extends any = any,
  E extends any = any
  /* eslint-enable @typescript-eslint/no-unnecessary-type-constraint, @typescript-eslint/no-unused-vars */
> extends ZodTypeMap<A, B, C, D, E> {}

export interface TypeDefMap<
  /* eslint-disable @typescript-eslint/no-unnecessary-type-constraint, @typescript-eslint/no-unused-vars */
  A extends any = any,
  B extends any = any,
  C extends any = any,
  D extends any = any,
  E extends any = any
  /* eslint-enable @typescript-eslint/no-unnecessary-type-constraint, @typescript-eslint/no-unused-vars */
> extends ZodTypeDefMap<A, B, C, D, E> {}

export enum InnerTypes {}

export type AllTypes = InnerTypes | ZodFirstPartyTypeKind

export const AllTypes = { ...InnerTypes, ...ZodFirstPartyTypeKind }

export type AllType = keyof TypeMap

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
