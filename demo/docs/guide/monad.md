# Monad

## Number

* modes: `input | slider | split`

```typescript zodui:preview
// configure
z.object({
  mode: z.union([
    z.literal('input'),
    z.literal('slider'),
    z.literal('split'),
  ])
})
// preview
import * as z from 'zod'

export default z.object({
  common: z.number(),
  split: z.number().mode('split'),
  slider: z.number().mode('slider'),
})
```

## String

## Boolean

## Date
