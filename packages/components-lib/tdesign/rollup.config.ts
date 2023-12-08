import rollupTemplate from 'rollup-helper/rollup.template'
import copy from 'rollup-plugin-copy'

export default rollupTemplate({
  styled: true,
  plugins: {
    dts: copy({ targets: [{ src: 'src/react.fix.d.ts', dest: 'dist' }] })
  }
})
