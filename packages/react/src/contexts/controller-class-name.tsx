import type { PropsWithChildren } from 'react'
import { createContext, useContext, useState } from 'react'

interface ControllerClassNameContext {
  setClassName: (className: string) => void
}

const ControllerClassName = createContext<ControllerClassNameContext>(null)

export function useControllerClassName() {
  const [className, setClassName] = useState('')
  return {
    className,
    ControllerClassName: ({ children }: PropsWithChildren) => <ControllerClassName.Provider value={{ setClassName }}>
      {children}
    </ControllerClassName.Provider>
  }
}

export const useControllerClassNameContext = () => useContext(ControllerClassName)
