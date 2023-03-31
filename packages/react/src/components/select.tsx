import { BaseCompProps, BaseComps } from './base'

export function Select<T extends BaseCompProps.SelectValue>({
  ...props
}: BaseCompProps.Select<T> & {
}) {
  props = Object.assign({
  }, props)
  if (BaseComps.Select) {
    return <BaseComps.Select
      {...props}
    />
  }
  // TODO support protogenesis select
  return <></>
}
