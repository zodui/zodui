/// <reference types="vite/client" />
import '../public/monaco/monaco'

export declare global {
  import type z from 'zod'
  const z: z
  const MONACO_DTS_FILES: {
    content: string;
    filePath: string;
  }[]
  /**
   * copy content to clipboard
   */
  function copyToClipboard(content: string): void
  /**
   * base64 encode and decode
   */
  function base64(str: string, isDecode = true): string
  /**
   * throttle
   */
  function throttle<T extends Function>(fn: T, delay: number): T
  /**
   * debounce
   */
  function debounce<T extends Function>(fn: T, delay: number): T
  /**
   * display a message
   */
  function showMessage(content: string, duration = 3000): void

  const theme: 'light' | 'dark' | (string & {})
  function onThemeChange(fn: (t: typeof theme) => void)

  function onCodeChange(key: string, fn: (code: string) => void): () => void
  function emitCode(key: string, code: string): void

  type Emitter<Args extends any[]> = {
    on: (k: string, ...args: Args) => () => void
    emit: (k: string, ...args: Args) => void
  }

  const evalerValueEmitter: Emitter<[value: any]>
  const evalerConfigureEmitter: Emitter<[value: any]>

  interface Tab {
    href: string
    title: string
    disabled?: boolean
  }
  const TABS: Tab[]

  interface Window {
    z: z

    theme: typeof theme
    base64: typeof base64

    onThemeChange: typeof onThemeChange

    onCodeChange: typeof onCodeChange
    emitCode: typeof emitCode

    evalerValueEmitter: typeof evalerValueEmitter
    evalerConfigureEmitter: typeof evalerConfigureEmitter

    TABS: typeof TABS
    MONACO_DTS_FILES: typeof MONACO_DTS_FILES
  }
}
