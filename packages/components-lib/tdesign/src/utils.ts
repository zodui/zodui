import type { Narrow } from '@zodui/core/utils'

export function isTargetType<T, Types extends T>(t: T | Types, types: Narrow<Types[]>): t is Types {
  // @ts-ignore
  return types.includes(t)
}

export function calcTimeStr(v?: Date) {
  return v ? `${v.getHours()}:${v.getMinutes()}:${v.getSeconds()}` : undefined
}
