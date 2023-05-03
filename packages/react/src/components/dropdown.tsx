import type { Frameworks } from '@zodui/core'
import { useCoreContextComponent } from '@zodui/react'

export type Dropdown = Frameworks['react']['Components']['Dropdown']

export const Dropdown: Dropdown = (props) => {
  const Dropdown = useCoreContextComponent('Dropdown')
  if (Dropdown)
    return <Dropdown {...props} />
  // TODO implement original Dropdown
  return <></>
}
