import type { ErrorInfo } from 'react'
import React from 'react'

export class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
    error: undefined as Error | undefined
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <div className='catched-error'>
        <pre>{this.state.error?.stack}</pre>
      </div>
    }

    return this.props.children
  }
}
