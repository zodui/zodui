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
z.number()
```

## String

## Boolean

## Date
