import type { Schema, ZodTypeAny, ZodTypeDef, ZodUnionOptions } from 'zod'
import { ZodFirstPartyTypeKind, ZodUnion } from 'zod'

import type { AllType, TypeMap } from './type'

type Cast<A, B> = A extends B ? A : B;

type Primitive = string | number | boolean | bigint | symbol | undefined | null;

export type Narrow<T> = Cast<T, unknown[] | [] | (T extends Primitive ? T : never) | ({
  [K in keyof T]: Narrow<T[K]>
})>;

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
}

export function getModes(mode: string) {
  return mode
    ?.split(' ')
    ?.filter(s => s !== ' ' && s !== '')
    ?? []
}

interface IsWhatType {
  <T extends AllType>(
    s: Schema<any, ZodTypeDef & {
      typeName?: AllType
    }, any>,
    type: T
  ): s is TypeMap[T]
  <T extends AllType>(
    s: ZodTypeDef & {
      typeName?: AllType
    },
    type: T
  ): s is TypeMap[T]['_def']
}

export const isWhatType = ((s: any, type) => (s?._def || s)?.typeName === type) as IsWhatType

export function isWhatTypes<T extends AllType>(
  s: Schema<any, ZodTypeDef & {
    typeName?: AllType
  }, any>,
  types: T[]
): s is TypeMap[T] {
  return types.includes(s?._def?.typeName as any)
}

export function getDefaultValue(s: Schema) {
  if (isWhatType(s, ZodFirstPartyTypeKind.ZodDefault)) {
    return s?._def?.defaultValue()
  }
  return undefined
}

export function containSome(a: string[], b: string[]) {
  for (const item of a) {
    if (b.includes(item)) {
      return true
    }
  }
}

export function inlineMarkdown(md: string) {
  return md
    .replace(/\[([^\]]+)]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/~~([^~]+)~~/g, '<del>$1</del>')
    .replace(/\n/g, '<br />')
    .replace(/\|\|([^|]+)\|\|/g, '<span class="spoiler">$1</span>')
}

export function merge<T extends {}, U extends {}>(a: T, b: U): T & U {
  const target = {} as T & U
  const aKeys = Object.keys(a) as (keyof T)[]
  const bKeys = Object.keys(b) as (keyof U)[]
  for (const key of aKeys) {
    const aItem = a[key]
    if (Object.hasOwn(b, key)) {
      // @ts-ignore
      const bItem = b[key]
      if (Array.isArray(aItem) && Array.isArray(bItem)) {
        target[key] = [...aItem, ...bItem] as any
        break
      }
      if (typeof aItem === 'object' && typeof bItem === 'object') {
        // TODO remove as any
        target[key] = merge(aItem as any, bItem)
        break
      }
    }
    target[key] = a[key] as any
  }
  for (const key of bKeys) {
    if (!Object.hasOwn(a, key)) {
      target[key] = b[key] as any
    }
  }
  return { ...a, ...b }
}

export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timer: any
  return (...args: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

export function classnames(...args: (string | undefined | null | false | Record<string, boolean>)[]) {
  return args
    .filter(<T>(v: T | boolean | null | undefined): v is T => Boolean(v))
    .map(arg => {
      if (typeof arg === 'string') {
        return arg
      }
      return Object.keys(arg).filter(key => arg[key]).join(' ')
    }).join(' ')
}

export const flatUnwrapUnion = <
  T extends ZodUnionOptions = readonly [ZodTypeAny, ...ZodTypeAny[]]
>(
    t: ZodUnion<T>
  ): Mutable<T> => {
  return t.options.flatMap((x) => {
    if (x instanceof ZodUnion) {
      return flatUnwrapUnion(x)
    }
    return x
  }) as unknown as T
}
