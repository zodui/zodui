/// <reference types="vite/client" />

export declare global {
  import z from 'zod'
  const z: z
  function onCodeChange(fn: (code: string) => void): () => void
  interface Window {
    z: z
    onCodeChange: typeof onCodeChange
  }
}
