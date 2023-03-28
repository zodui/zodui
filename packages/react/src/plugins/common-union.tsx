import { AllTypes, containSome } from '../utils'
import { plgMaster, Plugin } from './index'
import { ControllerRender } from '../components'
import { WrapModes } from '../configure'
import { RadioGroup, Radio } from 'tdesign-react/esm'

WrapModes.push('radio-inline', 'button')

plgMaster.register(new Plugin()
  .addComp([AllTypes.ZodUnion], [
    [
      modes => containSome(modes, ['radio', 'radio-inline', 'button']),
      ({ modes, options, isSame, OptionRender, ...props }) => <>
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
        {!isSame && <OptionRender/>}
      </>
    ]
  ])
)
