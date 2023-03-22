import z, {
  ZodAnyDef,
  ZodArrayDef,
  ZodBigIntDef,
  ZodBooleanDef,
  ZodBrandedDef,
  ZodCatchDef,
  ZodDateDef, ZodDefaultDef,
  ZodDiscriminatedUnionDef, ZodEffectsDef, ZodEnumDef,
  ZodFirstPartyTypeKind,
  ZodFunctionDef,
  ZodIntersectionDef,
  ZodLazyDef,
  ZodLiteralDef,
  ZodMapDef,
  ZodNaNDef, ZodNativeEnumDef,
  ZodNeverDef, ZodNullableDef,
  ZodNullDef,
  ZodNumberDef,
  ZodObjectDef, ZodOptionalDef,
  ZodPipelineDef,
  ZodPromiseDef,
  ZodRecordDef,
  ZodSetDef,
  ZodStringDef,
  ZodSymbolDef,
  ZodTupleDef,
  ZodTypeDef,
  ZodUndefinedDef,
  ZodUnionDef,
  ZodUnknownDef,
  ZodVoidDef
} from 'zod'
import { useMemo } from 'react'

export function getModes(mode: string) {
  return mode
    ?.split(' ')
    ?.filter(s => s !== ' ' && s !== '')
    ?? []
}

export function useModes<T extends z.ZodTypeAny>(schema: T) {
  return useMemo(() => getModes(schema._mode), [schema._mode])
}

export interface ZodTypeDefMap {
  ZodString: ZodStringDef
  ZodNumber: ZodNumberDef
  ZodNaN: ZodNaNDef
  ZodBigInt: ZodBigIntDef
  ZodBoolean: ZodBooleanDef
  ZodDate: ZodDateDef
  ZodSymbol: ZodSymbolDef
  ZodUndefined: ZodUndefinedDef
  ZodNull: ZodNullDef
  ZodAny: ZodAnyDef
  ZodUnknown: ZodUnknownDef
  ZodNever: ZodNeverDef
  ZodVoid: ZodVoidDef
  ZodArray: ZodArrayDef
  ZodObject: ZodObjectDef
  ZodUnion: ZodUnionDef
  ZodDiscriminatedUnion: ZodDiscriminatedUnionDef<any>
  ZodIntersection: ZodIntersectionDef
  ZodTuple: ZodTupleDef
  ZodRecord: ZodRecordDef
  ZodMap: ZodMapDef
  ZodSet: ZodSetDef
  ZodFunction: ZodFunctionDef
  ZodLazy: ZodLazyDef
  ZodLiteral: ZodLiteralDef
  ZodEnum: ZodEnumDef
  ZodEffects: ZodEffectsDef
  ZodNativeEnum: ZodNativeEnumDef
  ZodOptional: ZodOptionalDef
  ZodNullable: ZodNullableDef
  ZodDefault: ZodDefaultDef
  ZodCatch: ZodCatchDef
  ZodPromise: ZodPromiseDef
  ZodBranded: ZodBrandedDef<any>
  ZodPipeline: ZodPipelineDef<any, any>
}

export function isWhatType<T extends ZodFirstPartyTypeKind>(
  s: z.Schema<any, ZodTypeDef & {
    typeName?: ZodFirstPartyTypeKind
  }, any>,
  type: T
): s is z.Schema<any, ZodTypeDefMap[T], any> {
  return s?._def?.typeName === type
}

export function getDefaultValue(s: z.Schema) {
  if (isWhatType(s, ZodFirstPartyTypeKind.ZodDefault)) {
    return s?._def?.defaultValue()
  }
  return undefined
}

export function useDefaultValue(s: z.Schema) {
  return useMemo(() => getDefaultValue(s), [s._def])
}
