import { BaseCompProps, BaseComps } from './base'

export function Dropdown(props: BaseCompProps.Dropdown) {
  if (BaseComps.Dropdown) {
    return <BaseComps.Dropdown {...props} />
  }
  return <></>
}
