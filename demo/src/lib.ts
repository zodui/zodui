const codeChangeListeners: Record<string, Function[]> = {}

window.onCodeChange = function (key, fn) {
  if (!codeChangeListeners[key]) {
    codeChangeListeners[key] = []
  }
  const curCodeChangeListeners = codeChangeListeners[key]
  curCodeChangeListeners.push(fn)

  const index = curCodeChangeListeners.length - 1
  return () => {
    if (index > -1) curCodeChangeListeners.splice(index, 1)
  }
}

window.emitCode = function (key: string, s: string) {
  let i = setInterval(() => {
    if (codeChangeListeners[key]) {
      codeChangeListeners[key].forEach((fn) => fn(s))
      clearInterval(i)
    }
  }, 100)
}
