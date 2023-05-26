import './index.scss'

import { AllTypes, definePlugin } from '@zodui/core'

export const CommonPlugin = definePlugin('CommonPlugin', ctx => {
  ctx.defineUnit('monad', [AllTypes.ZodNumber], [
    [modes => modes.includes('slider'), 'Number.Slider']
  ])
})

export default CommonPlugin
