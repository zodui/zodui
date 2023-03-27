import { AllTypes, containSome } from '../utils'
import { plgMaster, Plugin } from './index'
import { ControllerRender } from '../components'
import { WrapModes } from '../configure'
import { RadioGroup } from 'tdesign-react/esm'

WrapModes.push('radio-inline')

plgMaster.register(new Plugin()
  .addComp([AllTypes.ZodUnion], [
    [
      modes => containSome(modes, ['radio', 'radio-inline']),
      ({ options, ...props }) => <RadioGroup
        options={options}
        {...props}
      />
    ]
  ])
)
