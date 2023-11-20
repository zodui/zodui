const main = document.querySelector<HTMLDivElement>('body > main')
const mainPages = document.querySelector('body > main > .pages')
const pList = main.querySelectorAll(':scope > div[class^="p"]')
console.log(mainPages, pList)

// eslint-disable-next-line no-unused-labels
initMainPages: {
  mainPages.innerHTML = Array(pList.length).reduce((prev, cur, i) => {
    return prev + `<div class="page" data-page="${i}"></div>`
  }, '')
}

const startButton = document.querySelector<HTMLDivElement>('.start-button')
startButton.addEventListener('click', () => {
  if (page > 0) return

  location.href = '/zodui/play'
})
let page = 0

main.addEventListener('scroll', () => {
  const progress = Math.round((
    main.scrollTop / (main.scrollHeight - main.clientHeight)
  ) * 1000) / 1000
  let np = progress * (pList.length - 1)
  if (np - Math.floor(np) < 0.05) np = Math.floor(np)

  main.style.setProperty('--page', np.toString())
  if (np === Math.floor(np)) {
    page = np
    main.setAttribute('data-page', page.toString())
  }
})

const logo = document.querySelector<HTMLDivElement>('.p1 > .logo')
const favicon = logo.querySelector<HTMLLinkElement>('img')

const mouse = {
  x: 0,
  y: 0,
  _x: 0,
  _y: 0,
  update(event: MouseEvent) {
    this.x = this._x - event.offsetX
    this.y = event.offsetY - this._y
  },
  setOrigin(e: HTMLElement) {
    this._x = e.offsetWidth / 2
    this._y = e.offsetHeight / 2
  }
}
mouse.setOrigin(logo)
let counter = 0
function isTimeToChange() {
  return counter++ % 10 === 0
}
function updateTransformStyle(x: string, y: string) {
  const style = `rotateX(${x}deg) rotateY(${y}deg)`
  ;['transform', '-webkit-transform', '-moz-transform', '-ms-transform', '-o-transform']
    .forEach(p => {
      favicon.style.setProperty(p, style)
    })
}
function update(e: MouseEvent) {
  mouse.update(e)
  updateTransformStyle(
    (mouse.y / logo.offsetHeight / 2).toFixed(2),
    (mouse.x / logo.offsetWidth / 2).toFixed(2)
  )
}
logo.addEventListener('mouseenter', update)
logo.addEventListener('mouseleave', () => {
  favicon.style.setProperty('transform', 'none')
})
logo.addEventListener('mousemove', e => {
  if (isTimeToChange()) update(e)
})
