import './schema-eval.scss'

import { TDesignComponentsLibForReact } from '@zodui/components-lib-tdesign'
import { Context } from '@zodui/core'
import { CommonPluginForReact } from '@zodui/plugin-common'
import { StrictMode, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

import { ErrorBoundary } from './react/ErrorBoundary'
import { Demo } from './schema-eval.react'

let root = document.querySelector<HTMLDivElement>('#root')
if (!root) {
  root = document.createElement('div')
  root.id = 'root'
  root.style.display = 'none'
  document.body.appendChild(root)
}
const portalMetas: [HTMLDivElement, React.ReactPortal][] = []

function ReactApp() {
  const firstRender = useRef(true)
  if (firstRender.current) {
    firstRender.current = false
    // createPortal is not cleared innerHTML of elements
    portalMetas.forEach(([el]) => {
      el.innerHTML = ''
    })
  }
  useEffect(() => {
    const e0 = Context.global.use(TDesignComponentsLibForReact)
    const e1 = Context.global.use(CommonPluginForReact)
    return () => {
      e0()
      e1()
    }
  }, [])
  return <>
    {portalMetas.map(([, p]) => p)}
  </>
}

document.querySelectorAll<HTMLDivElement>('.schema-eval-container')
  .forEach(el => {
    const { key = '', code, configure = '{}' } = el.dataset
    const configureObj = configure ? JSON.parse(configure) : undefined

    portalMetas.push([
      el, ReactDOM.createPortal(<ErrorBoundary>
        <Demo k={key} c={code} configure={configureObj} />
      </ErrorBoundary>, el, key)
    ])
  })

// eslint-disable-next-line react/no-deprecated
ReactDOM.render(<StrictMode><ReactApp /></StrictMode>, root)
