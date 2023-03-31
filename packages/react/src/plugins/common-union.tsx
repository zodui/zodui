import { RadioGroup, Radio } from 'tdesign-react/esm'

import { AllTypes, containSome } from '../utils'
import { plgMaster, Plugin } from './index'
import { ControllerRender } from '../controllers'
import { WrapModes } from '../configure'

WrapModes.push('radio-inline', 'button')

plgMaster.register(new Plugin()
  .addSubController([AllTypes.ZodUnion], [
    [
      modes => containSome(modes, ['radio', 'radio-inline', 'button']),
      ({ modes, options, OptionRender, ...props }) => <>
        {!modes?.includes('button')
          ? <RadioGroup
            options={options}
            {...props}
          />
          : <RadioGroup {...props}>
            {options.map(({
              label,
              title,
              value,
            }) => <Radio.Button title={title} value={value} key={value.toString()}>
              {label}
            </Radio.Button>)}
          </RadioGroup>}
        {OptionRender}
      </>
    ]
  ])
)
