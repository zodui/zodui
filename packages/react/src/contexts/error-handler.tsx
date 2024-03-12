import type {
  Dispatch, PropsWithChildren, ReactNode, SetStateAction
} from 'react'
import {
  createContext,
  useCallback,
  useContext, useEffect,
  useMemo,
  useState
} from 'react'

interface ErrorHandler {
  reset: () => void
  error?: Error
  throwError: (error: string | Error) => ReactNode
  ThrowError: (props: {
    error: string | Error
  }) => ReactNode
}

const ErrorHandler = createContext<ErrorHandler | null>(null)

function ErrorComp({ error, setE }: { error: Error, setE: Dispatch<SetStateAction<Error | undefined>> }) {
  useEffect(() => {
    setE(error)
  }, [error, setE])
  return <></>
}

export function useErrorHandler() {
  const [e, setE] = useState<Error>()

  const errorHandler = useMemo<ErrorHandler>(() => ({
    reset: () => setE(undefined),
    error: e,
    throwError(error) {
      if (typeof error === 'string') {
        error = new Error(error)
      }
      if (error.message === e?.message) {
        return null
      }
      return <ErrorComp error={error} setE={setE}/>
    },
    ThrowError({ error }) {
      return this.throwError(error)
    }
  }), [e])

  return {
    reset: () => setE(undefined),
    error: e,
    ErrorHandler: useCallback(({ children }: PropsWithChildren<{}>) => <ErrorHandler.Provider value={errorHandler} >
      {children}
    </ErrorHandler.Provider>, [errorHandler])
  }
}

export const useErrorHandlerContext = () => useContext(ErrorHandler)
