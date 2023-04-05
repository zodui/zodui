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

const themeSwitches = document.querySelectorAll<HTMLDivElement>('.theme-switch')

themeSwitches.forEach(themeSwitch => {
  themeSwitch.dataset.mode = localStorage.getItem(THEME_STORE_KEY) ?? 'auto'

  updateTheme()
  themeSwitch.addEventListener('click', function (e) {
    let switchChild = e.target as HTMLElement
    while (switchChild.parentNode !== this) {
      switchChild = switchChild.parentNode as HTMLElement
    }
    themeSwitch.dataset.mode = switchChild.dataset.mode
    localStorage.setItem(THEME_STORE_KEY, switchChild.dataset.mode ?? 'auto')
    updateTheme()
  })
})
