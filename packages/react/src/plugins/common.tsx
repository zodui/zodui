import './common.scss'

import { AllTypes, WrapModes } from '@zodui/core'
import { containSome } from '@zodui/core/utils'
import { useEffect, useMemo } from 'react'
import { Radio, RadioGroup } from 'tdesign-react/esm'
import type { Schema } from 'zod'

import { Icon, Input, InputAdornment, Rndr } from '../components'
import { useControllerClassNameContext } from '../contexts'
import { Plugin } from './index'

// TODO let button match range small
WrapModes.push('textarea', 'panel', 'radio-inline', 'button')

function isEqual(schemas: Schema[], types: AllTypes[]) {
  return schemas.length === types.length && schemas.every(
    (s, i) => (s._def as any)
      .typeName === types[i]
  )
}

export default () => new Plugin()
  .newSubControllerMatcher('monad', [AllTypes.ZodNumber], [
    [
      modes => modes.includes('slider'),
      props => <Rndr target='Number.Slider' {...props} />
    ],
    [
      modes => modes.includes('split'),
      props => <Input type='number' mode='split' {...props} />
    ]
  ])
  .newSubControllerMatcher('monad', [AllTypes.ZodString], [
    [
      modes => modes.includes('textarea'),
      props => <Rndr target='String.TextArea' {...props} />
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
              cursor: 'pointer'
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
      ({ modes, ...props }) => <Rndr
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
    [(modes, { schemas }) => !modes.includes('no-range') && isEqual(schemas, [AllTypes.ZodDate, AllTypes.ZodDate]), ({
      modes,
      schemas: _,
      ...props
    }) => {
      const { setClassName } = useControllerClassNameContext()
      const datetime = useMemo(() => [
        modes.includes('datetime') || modes.includes('date'),
        modes.includes('datetime') || modes.includes('time')
      ], [modes])
      // fallback to date picker
      if (datetime[0] === false && datetime[1] === false) {
        datetime[0] = true
      }
      useEffect(() => {
        setClassName(`common-picker ${
          datetime[0] ? 'date' : ''
        }${
          datetime[1] ? 'time' : ''
        }-picker`)
      }, [datetime, modes, setClassName])
      return <Rndr
        target='Date:PickerRange'
        isPanel={modes.includes('panel')}
        datetime={datetime}
        {...props}
      />
    }],
    // TODO support number range input
    [(modes, { schemas }) => !modes.includes('no-slider') && isEqual(schemas, [AllTypes.ZodNumber, AllTypes.ZodNumber]), ({
      schemas: _,
      ...props
    }) => <Rndr target='Number.Slider' range {...props} />]
  ])
  .newSubControllerMatcher('complex', [AllTypes.ZodUnion], [
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
              value
            }) => <Radio.Button title={title} value={value} key={value.toString()}>
              {label}
            </Radio.Button>)}
          </RadioGroup>}
        {OptionRender}
      </>
    ]
  ])
