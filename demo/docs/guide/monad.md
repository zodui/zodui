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
z.object({
  common: z.number(),
  split: z.number().mode('split'),
  slider: z.number().mode('slider'),
})
```

## String

## Boolean

## Date
