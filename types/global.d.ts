declare global {
  interface Window {
    JSBridge: ReturnType<JSBridge['exposePublic']>
  }
}

export {}