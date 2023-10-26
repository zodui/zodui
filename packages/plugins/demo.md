```typescript jsx
// index.ts
ctx
  .defineUnit('monad', [AllTypes.ZodNumber], [
    [modes => modes.includes('slider'), 'Number:Slider'],
  ])
  .defineUnit('monad', [AllTypes.ZodString], [
    [modes => modes.includes('textarea'), 'String:Textarea'],
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
// react.tsx
ctx
  .framework('react')
  // Rndr
  .defineRndr('Number:Slider', Slider)
  .defineRndr('String:Textarea', Textarea)
  .defineUnit('monad', [AllTypes.Number], [
    [modes => modes.includes('split'), props => <Input type='number' mode='split' {...props} />],
  ])
// vue.ts
ctx
  .framework('vue')
  .defineRndr('Number:Slider', Slider)
  .defineRndr('String:Textarea', Textarea)
  .defineUnit('monad', [AllTypes.Number], [
    [modes => modes.includes('split'), props => [Input, {
      type: 'number',
      mode: 'split',
      ...props,
    }]],
  ])
```
