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

export const TDesignComponentsLibForReact = definePlugin('TDesign:React', (ctx) => {
  ctx
    .framework('react')
})

export default TDesignComponentsLibForReact
