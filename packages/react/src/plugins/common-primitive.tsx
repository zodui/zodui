import { AllTypes } from '../utils'
import { plgMaster, Plugin } from './index'
import { ControllerRender, Icon, Input, InputAdornment } from '../components'
import { WrapModes } from '../configure'

WrapModes.push('textarea', 'panel')

plgMaster.register(new Plugin()
  .addComp([AllTypes.ZodNumber], [
    [
      modes => modes.includes('slider'),
      props => <ControllerRender target='Number.Slider' {...props} />
    ],
    [
      modes => modes.includes('split'),
      props => <Input type='number' mode='split' {...props} />
    ]
  ])
  .addComp([AllTypes.ZodString], [
    [
      modes => modes.includes('textarea'),
      props => <ControllerRender target='String.TextArea' {...props} />
    ],
    [
      modes => modes.includes('secrets'),
      props => <Input type='password' {...props} />
    ],
    [
      modes => modes.includes('link'),
      props => <InputAdornment
        next={<div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            fontSize: 20,
            cursor: 'pointer',
          }}
          onClick={() => {
            if (!props.value)
              return

            window.open(props.value, '_blank')
          }}
        ><Icon name='Link' /></div>}
      >
        <Input {...props}/>
      </InputAdornment>
    ]
  ])
)
