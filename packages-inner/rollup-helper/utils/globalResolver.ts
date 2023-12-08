export default function (external: string) {
  if (external.startsWith('@zodui/')) {
    return external
      .replace(/[@/-](\w)/g, (_, c) => c.toUpperCase())
  }
  return {
    react: 'React',
    // TODO `react/jsx-runtime` is not supported `umd`
    'react/jsx-runtime': 'ReactJSXRuntime',
    // https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.development.js
    'react-dom': 'ReactDOM',
    // https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.development.js
    // TODO make the library use the global variable `TDesignReact` replace `TDesign`
    'tdesign-react/esm': 'TDesign',
    // https://cdn.jsdelivr.net/npm/tdesign-react@1.4.0/dist/tdesign.js
    // https://cdn.jsdelivr.net/npm/tdesign-react@1.4.0/dist/tdesign.css
    'tdesign-icons-react': 'TDesignIconReact',
    // https://cdn.jsdelivr.net/npm/tdesign-icons-react@1.4.0/dist/index.js
    zod: 'Zod',
    '@zodui/core': 'ZodUICore',
    '@zodui/core/utils': 'ZodUICoreUtils',
    '@zodui/react': 'ZodUIReact'
  }[external]
}
