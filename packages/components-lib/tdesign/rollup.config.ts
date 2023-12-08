import rollupTemplate from 'packages-inner/rollup-helper/rollup.template'
import copy from 'rollup-plugin-copy'

export default rollupTemplate({
  index: 'src/index.ts',
  react: 'src/react/index.tsx'
}, {
  styled: true,
  plugins: {
    dts: copy({
      targets: [
        { src: 'src/react.fix.d.ts', dest: 'dist' }
      ]
    })
  }
})
