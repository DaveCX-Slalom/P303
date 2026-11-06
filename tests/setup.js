// Newer Node versions ship an experimental global localStorage that shadows jsdom's and has no usable API
// without a backing file. Give tests a plain in-memory Storage so stores that persist state behave as in a browser.
function memoryStorage() {
  let data = new Map()
  return {
    get length() { return data.size },
    key: (i) => [...data.keys()][i] ?? null,
    getItem: (k) => (data.has(String(k)) ? data.get(String(k)) : null),
    setItem: (k, v) => void data.set(String(k), String(v)),
    removeItem: (k) => void data.delete(String(k)),
    clear: () => void (data = new Map())
  }
}

for (const name of ['localStorage', 'sessionStorage']) {
  const store = memoryStorage()
  Object.defineProperty(globalThis, name, { value: store, configurable: true, writable: true })
  if (typeof window !== 'undefined') Object.defineProperty(window, name, { value: store, configurable: true, writable: true })
}
