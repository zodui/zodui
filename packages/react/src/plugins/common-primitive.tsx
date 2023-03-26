import { AllTypes } from '../utils'
import { plgMaster, Plugin } from './index'
import { ControllerRender } from '../components'

plgMaster.register(new Plugin()
  .addComp([AllTypes.ZodNumber], [
    [
      modes => modes.includes('slider'),
      props => <ControllerRender target='Number.Slider' {...props} />
    ]
  ])
  .addComp([AllTypes.ZodString], [
    [
      modes => modes.includes('textarea'),
      props => <ControllerRender target='String.TextArea' {...props} />
    ]
  ])
)
