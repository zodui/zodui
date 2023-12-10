import type { ZodRawShape, ZodUnionOptions } from 'zod'
import type z from 'zod'
import { ZodFirstPartyTypeKind } from 'zod'

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
  ZodArray: z.ZodArray<A>
  ZodObject: z.ZodObject<
    IsEqual<A, any> extends true
      ? ZodRawShape
      : A
  >
  ZodUnion: z.ZodUnion<ZodUnionOptions>
  ZodDiscriminatedUnion: z.ZodDiscriminatedUnion<A, B>
  ZodIntersection: z.ZodIntersection<A, B>
  ZodTuple: z.ZodTuple
  ZodRecord: z.ZodRecord
  ZodMap: z.ZodMap
  ZodSet: z.ZodSet
  ZodFunction: z.ZodFunction<A, B>
  ZodLazy: z.ZodLazy<A>
  ZodLiteral: z.ZodLiteral<A>
  ZodEnum: z.ZodEnum<A>
  ZodEffects: z.ZodEffects<A>
  ZodNativeEnum: z.ZodNativeEnum<A>
  ZodOptional: z.ZodOptional<A>
  ZodNullable: z.ZodNullable<A>
  ZodDefault: z.ZodDefault<A>
  ZodCatch: z.ZodCatch<A>
  ZodPromise: z.ZodPromise<A>
  ZodBranded: z.ZodBranded<A, B>
  ZodPipeline: z.ZodPipeline<A, B>
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
  ZodDiscriminatedUnion: z.ZodDiscriminatedUnionDef<A>
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
  ZodBranded: z.ZodBrandedDef<A>
  ZodPipeline: z.ZodPipelineDef<A, B>
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
