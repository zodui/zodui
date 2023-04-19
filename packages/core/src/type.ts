import z, { ZodFirstPartyTypeKind, ZodRawShape, ZodUnionOptions } from 'zod'

export interface ZodTypeMap {
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
  ZodArray: z.ZodArray<any>
  ZodObject: z.ZodObject<ZodRawShape>
  ZodUnion: z.ZodUnion<ZodUnionOptions>
  ZodDiscriminatedUnion: z.ZodDiscriminatedUnion<any, any>
  ZodIntersection: z.ZodIntersection<any, any>
  ZodTuple: z.ZodTuple
  ZodRecord: z.ZodRecord
  ZodMap: z.ZodMap
  ZodSet: z.ZodSet
  ZodFunction: z.ZodFunction<any, any>
  ZodLazy: z.ZodLazy<any>
  ZodLiteral: z.ZodLiteral<any>
  ZodEnum: z.ZodEnum<any>
  ZodEffects: z.ZodEffects<any>
  ZodNativeEnum: z.ZodNativeEnum<any>
  ZodOptional: z.ZodOptional<any>
  ZodNullable: z.ZodNullable<any>
  ZodDefault: z.ZodDefault<any>
  ZodCatch: z.ZodCatch<any>
  ZodPromise: z.ZodPromise<any>
  ZodBranded: z.ZodBranded<any, any>
  ZodPipeline: z.ZodPipeline<any, any>
}

export interface ZodTypeDefMap {
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
  ZodDiscriminatedUnion: z.ZodDiscriminatedUnionDef<any>
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
  ZodBranded: z.ZodBrandedDef<any>
  ZodPipeline: z.ZodPipelineDef<any, any>
}

export interface TypeMap extends ZodTypeMap {}

export interface TypeDefMap extends ZodTypeDefMap {}

export enum InnerTypes {}

export type AllTypes = InnerTypes | ZodFirstPartyTypeKind

export const AllTypes = { ...InnerTypes, ...ZodFirstPartyTypeKind }

export type AllType = keyof TypeMap
