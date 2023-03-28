import {
  createContext, Dispatch,
  PropsWithChildren,
  ReactElement,
  ReactNode, SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'

interface RenderProps extends PropsWithChildren {
  deps?: any[]
}

interface ItemSerterContext {
  Append?: (props: RenderProps) => ReactElement
}

const ItemSerterContext = createContext<ItemSerterContext>(null)

export function useItemSerter() {
  const [append, setAppend] = useState<ReactNode>(null)

  const genRender = useCallback((set: Dispatch<SetStateAction<ReactNode>>) => ({ children, deps = [] }: RenderProps) => {
    // TODO let memo watch chidlren change, or let react manage itself dependencies
    useEffect(() => set(children), [...deps])
    return null
  }, [])

  return {
    Append: useCallback(() => <>{append}</>, [append]),

    ItemSerter: useCallback(({ children }: PropsWithChildren) => <ItemSerterContext.Provider value={{
      Append: useCallback(genRender(setAppend), [genRender, setAppend])
    }}>
      {children}
    </ItemSerterContext.Provider>, [])
  }
}

export const useItemSerterContext = () => useContext(ItemSerterContext)
