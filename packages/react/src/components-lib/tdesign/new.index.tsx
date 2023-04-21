declare module '@zodui/core' {
  export interface FrameworkComponentsTDesignReact {
  }
  export interface FrameworkComponents {
    TDesign: {
      react: FrameworkComponentsTDesignReact
    }
  }
}

interface ComponentsLibMap {
  TDesign: {}
}

type ComponentsLibs = keyof ComponentsLibMap

interface ComponentsLib {
  use(): void
}

// should resolve effect
declare function defineComponentsLib(namespace: string, func: Function): ComponentsLib

export const TDesignComponentsLib = defineComponentsLib('TDesign', (ctx) => {
  ctx
    .framework('react')
    // .defineIcon('Xxx', Xxx)
    .defineComp('Input', Yyy)
    // .defineCtrl('Zzz', Zzz)
    // .defineView('Aaa', Aaa)
    // .defineStructure('Bbb', Bbb)
})

export default TDesignComponentsLib

declare const zodui: {
  use(...libs: ComponentsLib[]): typeof zodui
  configure(c: {
    platform: 'react' | 'vue',
    loaders: (
      | 'AntDesign'
      | 'TDesign'
    )[]
  }): typeof zodui
}

zodui
  .use(TDesignComponentsLib)

function Foo() {
  zodui.use(TDesignComponentsLib)
  return
}
