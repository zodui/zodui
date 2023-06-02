import { AllTypes, definePlugin } from '@zodui/core'
import { Icon, Input, InputAdornment, Rndr, useControllerClassNameContext } from '@zodui/react'
import { useEffect, useMemo } from 'react'

import Common from './index'
import { isEqual } from './utils'

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
    .defineUnit('monad', [AllTypes.ZodString], [
      [
        modes => modes.includes('textarea'),
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
    .defineUnit('multiple', [AllTypes.ZodTuple], [
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
          target='Range.Date.Picker'
          isPanel={modes.includes('panel')}
          datetime={datetime}
          {...props}
        />
      }]
    ])
})
