import { AllTypes } from '../utils'
import { Plugin } from './index'
import { Icon, Input, InputAdornment } from '../components'
import { AsProps, ControllerRender } from '../controllers'
import { WrapModes } from '../configure'
import { Schema } from 'zod'

declare module '@zodui/react' {
  interface ControllerPropsMapDate {
    PickerRange: ControllerPropsMapDate['Picker']
  }
  interface ControllerPropsMapDate {
    Picker: AsProps<{
      isPanel?: boolean
      datetime?: [true, true] | [true, false] | [false, true]
    }>
  }
  interface ControllerPropsMap {
    Number: {
      Slider: AsProps<{ range?: boolean }>
    }
    Date: ControllerPropsMapDate
  }
}

WrapModes.push('textarea', 'panel')

function isEqual(schemas: Schema[], types: AllTypes[]) {
  return schemas.length === types.length && schemas.every(
    (s, i) => (s._def as any)
      .typeName === types[i]
  )
}

export default new Plugin()
  .newSubControllerMatcher('monad', [AllTypes.ZodNumber], [
    [
      modes => modes.includes('slider'),
      props => <ControllerRender target='Number.Slider' {...props} />
    ],
    [
      modes => modes.includes('split'),
      props => <Input type='number' mode='split' {...props} />
    ]
  ])
  .newSubControllerMatcher('monad', [AllTypes.ZodString], [
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
  .newSubControllerMatcher('monad', [AllTypes.ZodDate], [
    [
      modes => modes.includes('datetime') || modes.includes('time') || modes.includes('date'),
      ({ modes, ...props }) => <ControllerRender
        target='Date:Picker'
        isPanel={modes.includes('panel')}
        datetime={[
          modes.includes('datetime') || modes.includes('date'),
          modes.includes('datetime') || modes.includes('time')
        ]}
        {...props}
      />
    ]
  ])
  .newSubControllerMatcher('multiple', [AllTypes.ZodTuple], [
    [(modes, { schemas }) =>!modes.includes('no-range') && isEqual(schemas, [AllTypes.ZodDate, AllTypes.ZodDate]), ({
      modes,
      schemas: _,
      ...props
    }) => {
      return <ControllerRender
        target='Date:PickerRange'
        isPanel={modes.includes('panel')}
        datetime={[
          modes.includes('datetime') || modes.includes('date'),
          modes.includes('datetime') || modes.includes('time')
        ]}
        {...props}
      />
    }],
    // TODO support number range input
    [(modes, { schemas }) =>!modes.includes('no-slider') && isEqual(schemas, [AllTypes.ZodNumber, AllTypes.ZodNumber]), ({
      modes,
      schemas: _,
      ...props
    }) => <ControllerRender target='Number.Slider' range {...props} />]
  ])
