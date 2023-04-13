import { createContext, PropsWithChildren, useContext } from 'react'

interface ItemConfigure {
  actualTimeVerify?: boolean
  verifyDebounceTime?: number
}

interface ItemConfigurerContext extends ItemConfigure {
}

const ItemConfigurer = createContext<ItemConfigurerContext>(null)

export function useItemConfigurer() {
  const configure = useContext(ItemConfigurer)
  return {
    configure,
    ItemConfigurer: ({ children }: PropsWithChildren) => <ItemConfigurer.Provider value={configure}>
      {children}
    </ItemConfigurer.Provider>
  }
}

const DEFAULT_CONFIGURE: ItemConfigure = {
  verifyDebounceTime: 300,
  actualTimeVerify: false
}

export const useItemConfigurerContext = () => useContext(ItemConfigurer) ?? DEFAULT_CONFIGURE
