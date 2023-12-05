# ZodUI Core

```tsx
z.object({
  name: z
    .string()
    .describe(`
      <label>Name</label>
      <self mode='textarea' />
      Please enter a plain text string.
    `)
}).label('User')
z.object({
  name: z
    .string()
    .describe(<>
      <label>Name</label>
      <self mode='textarea' />
      Please enter a plain text string.
    </>)
}).label('User')

interface User {
  /**
   * <label>Name</label>
   * <self mode='textarea' />
   * Please enter a plain text string.
   */
  name: string
}
```
```python
class User:
  """
  <label>Name</label>
  <self mode='textarea' />
  Please enter a plain text string.
  """
  name: str
```

## Generic

```tsx
const namedSkmGen = <T extends ZodString = ZodString>(T: T = string()) => object({
  name: T.label('Name')
})
const form0 = namedSkmGen()
const form1 = namedSkmGen(union([literal('a'), literal('b')]))

type NamedSkmGen<T extends string = string> = {
  name: T
}
type Form0 = infer<typeof namedSkmGen>
```
