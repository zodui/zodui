import './header.client.scss'

const hash = location.hash ? decodeURIComponent(location.hash) : null
let menuItem: HTMLLIElement | null = null
const menu = document.querySelector('ul.menu')

document.querySelectorAll<HTMLDivElement>('.anchor-point')
  .forEach(e => {
    const id = e.id
    if (hash && id === hash.slice(1)) {
      const newMenuItem = menu.querySelector(`a[href="${hash}"]`).parentElement as HTMLLIElement
      if (newMenuItem) {
        newMenuItem.classList.add('active')
        menuItem = newMenuItem
      }
      document.querySelector(hash)?.scrollIntoView()
    }
  })

addEventListener('hashchange', () => {
  if (!location.hash) return

  const hash = decodeURIComponent(location.hash)
  const newMenuItem = menu.querySelector(`a[href="${hash}"]`).parentElement as HTMLLIElement
  if (!newMenuItem) return

  menuItem?.classList.remove('active')
  newMenuItem.classList.add('active')
  menuItem = newMenuItem
})
