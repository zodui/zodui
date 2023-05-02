import { Frameworks } from '@zodui/core'
import { useCoreContextIcon } from '@zodui/react'

export type Icon = Frameworks['react']['Icon']

export const Icon: Icon = (props) => {
  const Comp = useCoreContextIcon(props.name)
  if (Comp)
    return <Comp {...props} />

  return <></>
}
