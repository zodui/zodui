import './schema-eval.scss'

import { StrictMode } from 'react'
import ReactDOM from 'react-dom'

import { ReactApp } from './react/App'
import { ErrorBoundary } from './react/ErrorBoundary'
import { portalMetas } from './react/potalMetas'
import { Demo } from './schema-eval.react'

let root = document.querySelector<HTMLDivElement>('#root')
if (!root) {
  root = document.createElement('div')
  root.id = 'root'
  root.style.display = 'none'
  document.body.appendChild(root)
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
