import './index.scss'

import { AllTypes, definePlugin } from '@zodui/core'
// import type { Schema } from 'zod'
//
//
// function isEqual(schemas: Schema[], types: AllTypes[]) {
//   return schemas.length === types.length && schemas.every(
//     (s, i) => (s._def as any)
//       .typeName === types[i]
//   )
// }

export const CommonPlugin = definePlugin('CommonPlugin', ctx => {
  ctx
    .defineUnit('monad', [AllTypes.ZodNumber], [
      [modes => modes.includes('slider'), 'Number.Slider']
    ])
    .defineUnit('monad', [AllTypes.ZodString], [
      [modes => modes.includes('slider'), 'String.TextArea']
    ])
    .defineUnit('monad', [AllTypes.ZodDate], [
      [
        modes => modes.includes('datetime') || modes.includes('time') || modes.includes('date'),
        ({ modes, ...props }) => ['Date:Picker', {
          isPanel: modes.includes('panel'),
          datetime: [
            modes.includes('datetime') || modes.includes('date'),
            modes.includes('datetime') || modes.includes('time')
          ],
          ...props
        }]
      ]
    ])
    // .defineUnit('multiple', [AllTypes.ZodTuple], [
    //   // TODO support number range input
    //   [(modes, { schemas }) => !modes.includes('no-slider') && isEqual(schemas, [AllTypes.ZodNumber, AllTypes.ZodNumber]), ({
    //     schemas: _,
    //     ...props
    //   }) => ['Number.Slider', { range: true, ...props }]]
    // ])
})

export default CommonPlugin
