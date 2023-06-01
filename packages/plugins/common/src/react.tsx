import { AllTypes, definePlugin } from '@zodui/core'
import { Input } from '@zodui/react'

import Common from './index'

export const CommonPluginForReact = definePlugin('CommonPlugin', ctx => {
  ctx.use(Common)
  ctx
    .framework('react')
    .defineUnit('monad', [AllTypes.ZodNumber], [
      [
        modes => modes.includes('split'),
        props => <Input type='number' mode='split' {...props} />
      ]
    ])
})
