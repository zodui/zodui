import './index.scss'
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
  ctx.use(() => import('./components').then(({ ComponentsOfTDesignComponentsLibForReact: plugin }) => plugin))
  ctx.use(() => import('./icons').then(({ IconsOfTDesignComponentsLibForReact: plugin }) => plugin))
  ctx.use(() => import('./renders').then(({ RendersOfTDesignComponentsLibForReact: plugin }) => plugin))
})

export default TDesignComponentsLibForReact
export * from './components'
export * from './icons'
export * from './renders'
