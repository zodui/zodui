import type { Frameworks } from '@zodui/core'

import { useCoreContextComponent } from '../contexts'

export type RadioGroup = Frameworks['react']['Components']['RadioGroup']

export const RadioGroup: RadioGroup = (props) => {
  const RadioGroup = useCoreContextComponent('RadioGroup')
  if (RadioGroup)
    return <RadioGroup {...props} />

  // TODO support radio group
  return <>Not support Radio Group</>
}
