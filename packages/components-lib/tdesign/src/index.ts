import { definePlugin } from '@zodui/core'

declare module '@zodui/core' {
  interface FrameworkComponentsTDesignReact {
  }
  export interface FrameworkComponents {
    TDesign: {
      react: FrameworkComponentsTDesignReact
    }
  }
}

export const TDesignComponentsLib = definePlugin('TDesign', ctx => {
  ctx.use(() => import('./react').then(({ default: plugin }) => plugin))
})

export default TDesignComponentsLib

export { TDesignComponentsLibForReact } from './react'
