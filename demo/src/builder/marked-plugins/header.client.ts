import './header.client.scss'

const main = document.querySelector<HTMLDivElement>('body > main')
const quickAccess = document.querySelector('div.quick-access')
let menuItem: HTMLLIElement | null = null

const hash = location.hash ? decodeURIComponent(location.hash) : null

let matchedElement: HTMLDivElement | null = null
document.querySelectorAll<HTMLDivElement>('.anchor-point')
  .forEach(e => {
    const id = e.id
    if (hash && id === hash.slice(1)) {
      const newMenuItem = quickAccess.querySelector(`a[href="${hash}"]`).parentElement as HTMLLIElement
      if (newMenuItem) {
        newMenuItem.classList.add('active')
        menuItem = newMenuItem
      }
      matchedElement = e
    }
  })
if (matchedElement) {
  setTimeout(() => {
    main.scrollTo({ top: matchedElement!.offsetTop - 10 })
  }, 500)
}
document.querySelectorAll('a[href^="#"]')
  .forEach(e => {
    e.addEventListener('click', e => {
      e.preventDefault()
      const aLinkEle = e.currentTarget as HTMLAnchorElement
      const hash = aLinkEle.getAttribute('href')
      if (!hash) return
      const header = document.querySelector<HTMLHeadElement>(decodeURIComponent(hash))
      if (!header) return
      main.scrollTo({ top: header.offsetTop - 10 })
      history.pushState(null, '', hash)
    })
  })

function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timer: number | null = null
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay) as unknown as number
  }
}

main.addEventListener('scroll', debounce(() => {
  const anchors = document.querySelectorAll<HTMLDivElement>('.anchor-point')
  let activeAnchor: HTMLDivElement | null = null
  for (let i = 0; i < anchors.length; i++) {
    const anchor = anchors[i]
    const rect = anchor.getBoundingClientRect()
    if (rect.top < 124) {
      activeAnchor = anchor
    } else {
      break
    }
  }
  if (!activeAnchor) return
  const id = activeAnchor.id
  const newMenuItem = quickAccess.querySelector(`a[href="#${id}"]`)?.parentElement as HTMLLIElement
  menuItem?.classList.remove('active')
  menuItem = newMenuItem
  if (!newMenuItem) return
  newMenuItem.classList.add('active')
}, 50))
