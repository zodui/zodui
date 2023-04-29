import { expect } from 'chai'
import { Context, definePlugin } from '@zodui/core'

declare module '@zodui/core' {
  interface Frameworks {
    __test__: {
      Components: {
        A0: any
        A1: any
        A2: any
        A3: any
        A4: any
        A5: any
      }
    }
  }
}

describe('Plugin', function () {
  const p0 = definePlugin('test', ctx => {
    ctx.framework('__test__')
      .defineComp('A0', 'A0')
      .defineComp('A1', 'A1')
  })
  const p1 = definePlugin('test', ctx => {
    ctx.framework('__test__')
      .defineComp('A2', 'A2')
      .defineComp('A3', 'A3')
  })
  const p_01 = definePlugin('test', ctx => {
    ctx.use(p0)
    ctx.use(p1)
    ctx.framework('__test__')
      .defineComp('A4', 'A4')
  })

  it('should be use plugin and off it', () => {
    const off = Context.global.use(p0)
    expect(Context.global.get('framework.__test__.components.A0')[0])
      .to.equal('A0')
    off()
    expect(Context.global.get('framework.__test__.components.A0')[0])
      .to.equal(undefined)
  })
  it('should be use multiple plugin and off it', () => {
    const off = Context.global.use(p_01)
    expect(Context.global.get('framework.__test__.components.A0')[0])
      .to.equal('A0')
    expect(Context.global.get('framework.__test__.components.A1')[0])
      .to.equal('A1')
    expect(Context.global.get('framework.__test__.components.A2')[0])
      .to.equal('A2')
    expect(Context.global.get('framework.__test__.components.A3')[0])
      .to.equal('A3')
    expect(Context.global.get('framework.__test__.components.A4')[0])
      .to.equal('A4')
    off()
    expect(Context.global.get('framework.__test__.components.A0')[0])
      .to.equal(undefined)
    expect(Context.global.get('framework.__test__.components.A1')[0])
      .to.equal(undefined)
    expect(Context.global.get('framework.__test__.components.A2')[0])
      .to.equal(undefined)
    expect(Context.global.get('framework.__test__.components.A3')[0])
      .to.equal(undefined)
    expect(Context.global.get('framework.__test__.components.A4')[0])
      .to.equal(undefined)
  })
})
