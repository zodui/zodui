import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react'

export interface ItemConfigure {
  actualTimeVerify?: boolean
  verifyDebounceTime?: number
}

interface ItemConfigurerContext extends ItemConfigure {
}

const ItemConfigurer = createContext<ItemConfigurerContext>(null)

export function useItemConfigurer(c: ItemConfigure = {}) {
  const pConfigure = useContext(ItemConfigurer)
  const [iConfigure, setIConfigure] = useState<ItemConfigure>(c)
  const configure = useMemo(() => ({
    ...DEFAULT_CONFIGURE,
    ...pConfigure,
    ...iConfigure
  }), [pConfigure, iConfigure])
  return {
    configure,
    setConfigure: setIConfigure,
    ItemConfigurer: ({ children }: PropsWithChildren) => <ItemConfigurer.Provider value={configure}>
      {children}
    </ItemConfigurer.Provider>
  }
}

const DEFAULT_CONFIGURE: ItemConfigure = {
  verifyDebounceTime: 300,
  actualTimeVerify: true
}

export const useItemConfigurerContext = () => useContext(ItemConfigurer) ?? DEFAULT_CONFIGURE
