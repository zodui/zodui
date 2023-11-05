import type {
  PropsWithChildren,
  ReactElement,
  ReactNode } from 'react'
import {
  createContext, useCallback,
  useContext,
  useEffect, useRef, useState
} from 'react'

interface RenderProps extends PropsWithChildren<{}> {
  deps?: any[]
}

interface ItemSerterContext {
  Append?: (props: RenderProps) => ReactElement
}

const ItemSerterContext = createContext<ItemSerterContext>(null)

export function useItemSerter() {
  const prevChangeListener = useRef<(v: any) => any>()
  const onPrevChange = useCallback((func: (v: any) => any) => {
    prevChangeListener.current = func
    return () => {
      prevChangeListener.current = undefined
    }
  }, [])
  const prev = useRef<ReactNode>()
  const prevChange = useCallback((v: ReactNode) => {
    prev.current = v
    prevChangeListener.current?.(v)
  }, [])

  return {
    Append: () => {
      const [item, setItem] = useState<ReactNode>(prev.current)
      useEffect(() => onPrevChange(setItem), [])
      return <>{item}</>
    },

    ItemSerter: useCallback(({ children }: PropsWithChildren<{}>) => <ItemSerterContext.Provider value={{
      Append: ({ children, deps = [] }: RenderProps) => {
        // TODO let memo watch children change, or let react manage itself dependencies
        // eslint-disable-next-line react-hooks/exhaustive-deps
        useEffect(() => prevChange(children), [...deps])
        return null
      }
    }}>
      {children}
    </ItemSerterContext.Provider>, [prevChange])
  }
}

export const useItemSerterContext = () => useContext(ItemSerterContext)
