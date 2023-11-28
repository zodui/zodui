import { AllTypes, definePlugin } from '@zodui/core'
import { Icon, Input, InputAdornment, RadioGroup, Rndr, Switch, useControllerClassNameContext } from '@zodui/react'
import { useCallback, useEffect, useMemo } from 'react'
import type { ZodLiteral, ZodUnion } from 'zod'

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
        modes => modes.includes('secret'),
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
    .defineUnit('complex', [AllTypes.ZodUnion], [
      [
        modes => ['radio', 'radio-outline', 'radio-card'].some(mode => modes.includes(mode)),
        props => {
          const direction = useMemo(() => {
            if (props.modes.includes('direction-row')) {
              return 'row'
            }
            if (props.modes.includes('direction-column')) {
              return 'column'
            }
          }, [props.modes])
          const variant = useMemo(() => {
            if (props.modes.includes('radio-outline')) {
              return 'outline'
            }
            if (props.modes.includes('radio-card')) {
              return 'card'
            }
          }, [props.modes])
          // TODO refactor as hook
          const getIndexByValue = useCallback((value: any) => {
            const option = props.model.options.find(option => (
              option._def.typeName === AllTypes.ZodLiteral
              && option._def.value === value
            ))
            if (option) {
              return props.model.options.indexOf(option)
            }
          }, [props.model.options])
          const index = useMemo(() => getIndexByValue(props.value), [props.value, getIndexByValue])
          const defaultIndex = useMemo(() => getIndexByValue(props.defaultValue), [props.defaultValue, getIndexByValue])
          return <RadioGroup
            {...props}
            {...{ variant, direction }}
            value={index}
            defaultValue={defaultIndex}
            onChange={index => {
              const optionModel = props.model.options[index]
              if (optionModel._def.typeName === AllTypes.ZodLiteral) {
                props.onChange?.(optionModel._def.value)
              }
            }}
          />
        }
      ],
      [
        // TODO better
        (modes, { model }) => !modes.includes('no-switch') && (model as ZodUnion<[ZodLiteral<any>, ...ZodLiteral<any>[]]>).options.every(option => (
          option._def.typeName === AllTypes.ZodLiteral
          && typeof option.value === 'boolean'
        )),
        props => <Switch {...props} />
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
          target='Range:Date:Picker'
          isPanel={modes.includes('panel')}
          datetime={datetime}
          {...props}
        />
      }]
    ])
})
