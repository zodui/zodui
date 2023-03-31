import { Schema } from 'zod'
import { DateRangePicker, TimeRangePicker } from 'tdesign-react/esm'

import { AllTypes } from '../utils'
import { plgMaster, Plugin } from './index'
import { WrapModes } from '../configure'
import { ControllerRender } from '../controllers'
import { AsProps } from '../controllers'

declare module '@zodui/react' {
  interface ControllerPropsMapDate {
    PickerRange: ControllerPropsMapDate['Picker']
  }
  interface ControllerPropsMap {
    Number: {
      Slider: AsProps<{ range?: boolean }>
    }
  }
}

WrapModes.push()

function isEqual(schemas: Schema[], types: AllTypes[]) {
  return schemas.length === types.length && schemas.every(
    (s, i) => (s._def as any)
      .typeName === types[i]
  )
}

plgMaster.register(new Plugin()
  .addSubController([AllTypes.ZodTuple], [
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
)
