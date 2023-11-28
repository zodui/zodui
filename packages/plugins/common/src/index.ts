import './index.scss'

import { AllTypes, definePlugin } from '@zodui/core'

import { isEqual } from './utils'
export { CommonPluginForReact } from './react'

export const CommonPlugin = definePlugin('CommonPlugin', ctx => {
  ctx
    .defineUnit('monad', [AllTypes.ZodNumber], [
      [modes => modes.includes('slider'), 'Number.Slider']
    ])
    .defineUnit('monad', [AllTypes.ZodString], [
      [modes => modes.includes('textarea'), 'String.TextArea']
    ])
    .defineUnit('monad', [AllTypes.ZodNumber, AllTypes.ZodString, AllTypes.ZodDate], [
      [
        modes => modes.includes('datetime') || modes.includes('time') || modes.includes('date'),
        ({ modes, modelType }) => ['Date:Picker', ({ value, defaultValue, onChange, ...props }) => {
          const passer = {
            inn: (v: unknown) => ({
              [AllTypes.ZodNumber]: () => v ? new Date(Number(v)) : undefined,
              [AllTypes.ZodString]: () => v ? new Date(String(v)) : undefined,
              [AllTypes.ZodDate]: () => v
            })[modelType](),
            out: (v: Date) => ({
              [AllTypes.ZodNumber]: () => v.getTime(),
              [AllTypes.ZodString]: () => v.toISOString(),
              [AllTypes.ZodDate]: () => v
            })[modelType]()
          }
          return {
            isPanel: modes.includes('panel'),
            datetime: [
              modes.includes('datetime') || modes.includes('date'),
              modes.includes('datetime') || modes.includes('time')
            ],
            value: passer.inn(value),
            defaultValue: passer.inn(defaultValue),
            onChange: (v: Date) => onChange?.(passer.out(v)),
            ...props
          }
        }]
      ]
    ])
    .defineUnit('multiple', [AllTypes.ZodTuple], [
      // TODO support number range input
      [(modes, { schemas }) => !modes.includes('no-slider') && isEqual(schemas, [AllTypes.ZodNumber, AllTypes.ZodNumber]), ({
        schemas: _,
        ...props
      }) => ['Number.Slider', { range: true, ...props }]]
    ])
})

export default CommonPlugin
