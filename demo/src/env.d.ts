/// <reference types="vite/client" />
/// <reference path="../public/monaco/monaco" />

export declare global {
  import z from 'zod'
  const z: z
  const ZOD_DTS_FILES: {
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

  function onCodeChange(fn: (code: string) => void): () => void

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

    TABS: typeof TABS
    ZOD_DTS_FILES: typeof ZOD_DTS_FILES
  }
}
