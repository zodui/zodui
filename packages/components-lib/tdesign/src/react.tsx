import React from 'react'
import { definePlugin } from '@zodui/core'
import { Narrow } from '@zodui/core/utils'

import {
  Input,
  InputNumber,
} from 'tdesign-react/esm'
import 'tdesign-react/esm/style/index.js'

declare module '@zodui/core' {
  export interface FrameworkComponentsTDesignReact {
  }
  export interface FrameworkComponents {
    TDesign: {
      react: FrameworkComponentsTDesignReact
    }
  }
}

function isTargetType<T, Types extends T>(t: T | Types, types: Narrow<Types[]>): t is Types {
  return types.includes(
    // @ts-ignore
    t
  )
}

export const TDesignComponentsLibForReact = definePlugin('TDesign', ctx => {
  ctx
    .framework('react')
    .defineComp('Input', ({
      type,
      mode,
      value,
      defaultValue,
      onChange,
      ...props
    }) => {
      if (isTargetType(type, ['email', 'tel', 'url', 'search'])) {
        return <>Not support type {type}</>
      }
      if (type === 'number' && mode === 'split') {
        const parseNumberValue = (t: any) => t !== undefined ? +t : undefined
        // TODO resolve NAN, Infinity, -Infinity
        return <InputNumber
          value={parseNumberValue(value)}
          defaultValue={parseNumberValue(defaultValue)}
          onChange={onChange as any}
        />
      }
      return <Input
        type={type}
        value={value as any}
        defaultValue={defaultValue as any}
        onChange={v => onChange?.(type === 'number' ? +v : v as any)}
        {...props}
      />
    })
})

export default TDesignComponentsLibForReact
