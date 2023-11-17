import * as path from 'path'
import { defineConfig } from 'rspress/config'

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'ZodUI',
  description: 'Model driven UI.',
  icon: '/favicon.png',
  logo: {
    light: '/favicon.png',
    // TODO dark icon?
    dark: '/favicon.png'
  },
  builderConfig: {
    dev: { port: 17114 }
  },
  themeConfig: {
    socialLinks: [
      { icon: 'github', mode: 'link', content: 'https://github.com/zodui/zodui' }
    ]
  }
})
