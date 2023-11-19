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
  const np = progress * (pList.length - 1)
  main.style.setProperty('--page', np.toString())
  if (np === Math.floor(np)) {
    page = np
    main.setAttribute('data-page', page.toString())
  }
})
