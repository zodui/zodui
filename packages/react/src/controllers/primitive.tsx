import {
  DatePicker, DatePickerPanel, TimePickerPanel,
  TimePicker
} from 'tdesign-react/esm'
import { useEffect, useState } from 'react'
import { ControllerProps } from './index'
import { useModes, TypeMap } from '../utils'
import { Input, Switch } from '../components'

import '../plugins/common-primitive'
import { plgMaster } from '../plugins'

export const primitive = [
  'string',
  'number',
  'boolean',
  'date'
]

export interface PrimitiveProps extends ControllerProps<TypeMap[
  | 'ZodNumber'
  | 'ZodString'
  | 'ZodDate'
  | 'ZodBoolean'
]> {
}

export function Primitive({
  schema,
  ...rest
}: PrimitiveProps) {
  const [value, setValue] = useState(rest.defaultValue || rest.value)
  const props = {
    ...rest,
    value,
    onChange: (v: any) => {
      setValue(v)
      rest.onChange?.(v)
    }
  }
  useEffect(() => {
    setValue(rest.defaultValue || rest.value)
  }, [rest.defaultValue || rest.value])
  const modes = useModes(schema)

  const targetPlgs = plgMaster.plgs[schema._def.typeName]
  for (const { compMatchers } of targetPlgs) {
    for (const compMatcher of compMatchers) {
      if (compMatcher.is(modes))
        return <compMatcher.Component schema={schema} {...props} />
    }
  }
  switch (schema._def.typeName) {
    case 'ZodNumber':
      return <Input type='number' {...props} />
    case 'ZodString':
      return <Input {...props}/>
    case 'ZodDate':
      switch (true) {
        case modes.includes('time'):
          if (modes.includes('panel'))
            return <TimePickerPanel {...props}/>
          return <TimePicker
            {...props}
          />
      }
      const nProps = {
        ...props,
        enableTimePicker: modes.includes('datetime')
      }
      if (modes.includes('panel'))
        return <DatePickerPanel {...nProps}/>
      return <DatePicker {...nProps}/>
    case 'ZodBoolean':
      return <Switch
        {...props}
      />
  }
  return <></>
}
