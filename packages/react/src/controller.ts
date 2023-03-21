import z from 'zod'

export interface ControllerProps {
  schema: z.Schema
  defaultValue?: any
  value?: any
  onChange?: (value: any) => void
  disabled?: boolean
  className?: string
}
