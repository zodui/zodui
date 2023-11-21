import './theme-switcher.scss'

const THEME_STORE_KEY = 'theme'

let curThemeMode: string | null = null

const themeChangeListeners: Function[] = []

window.onThemeChange = function (listener) {
  themeChangeListeners.push(listener)
  curThemeMode && listener(curThemeMode)
}

function updateTheme(mode?: string) {
  const theme = localStorage.getItem(THEME_STORE_KEY) ?? 'auto'
  if (theme !== 'auto') {
    mode = theme
  } else {
    if (mode === undefined) {
      const mediaQueryListDark = window.matchMedia('(prefers-color-scheme: dark)')
      mode = mediaQueryListDark.matches ? 'dark' : ''
    }
  }
  themeChangeListeners.forEach((listener) => listener(mode))
  curThemeMode = mode
  if (mode === 'dark') {
    document.documentElement.setAttribute('theme-mode', 'dark')
  } else {
    document.documentElement.removeAttribute('theme-mode')
  }
}

updateTheme()

window
  .matchMedia('(prefers-color-scheme: dark)')
  .addListener((mediaQueryListEvent) => {
    updateTheme(mediaQueryListEvent.matches ? 'dark' : '')
  })

const themeSwitcher = document.querySelector<HTMLDivElement>('.theme-switcher')
themeSwitcher.addEventListener('click', e => {
  const target = e.target
  if (target instanceof HTMLElement || target instanceof SVGElement) {
    if (target.closest('.dark-and-light')) {
      const auto = themeSwitcher.querySelector('.auto') as HTMLDivElement
      auto.classList.remove('active')

      const darkAndLight = target.closest('.dark-and-light') as HTMLDivElement
      const mode = {
        dark: 'light',
        light: 'dark'
      }[darkAndLight.dataset.mode]
      darkAndLight.dataset.mode = mode
      localStorage.setItem(THEME_STORE_KEY, mode)
      updateTheme(mode)
    }
    if (target.closest('.auto')) {
      const auto = target.closest('.auto') as HTMLDivElement
      auto.classList.toggle('active')
      localStorage.setItem(THEME_STORE_KEY, auto.dataset.mode)
      updateTheme()
    }
  }
})
