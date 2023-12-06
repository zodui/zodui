import './react.scss'
import 'tdesign-react/esm/style/index.js'

import { definePlugin } from '@zodui/core'

declare module '@zodui/core' {
  export interface FrameworkComponentsTDesignReact {
  }
  export interface FrameworkComponents {
    TDesign: {
      react: FrameworkComponentsTDesignReact
    }
  }
}

export const TDesignComponentsLibForReact = definePlugin('TDesign.React', ctx => {
  ctx.use(() => import('./react/components').then(({ ComponentsOfTDesignComponentsLibForReact: plugin }) => plugin))
  ctx.use(() => import('./react/icons').then(({ IconsOfTDesignComponentsLibForReact: plugin }) => plugin))
  ctx.use(() => import('./react/renders').then(({ RendersOfTDesignComponentsLibForReact: plugin }) => plugin))
})

export default TDesignComponentsLibForReact
export * from './react/components'
export * from './react/icons'
export * from './react/renders'
