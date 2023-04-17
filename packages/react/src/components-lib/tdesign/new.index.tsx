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
    .registerIcon('Xxx', Xxx)
    .registerBase('Yyy', Yyy)
    .registerCtrl('Zzz', Zzz)
    .registerView('Aaa', Aaa)
    .registerStructure('Bbb', Bbb)
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
