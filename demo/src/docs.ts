const tips = document.querySelector<HTMLDivElement>('.tips')

const tipElements = tips.querySelectorAll<HTMLDivElement>(':scope > .tip')

let startTime = Date.now()
let endTime: number | undefined
function activeTip() {
  let next = Math.floor(Math.random() * tipElements.length)

  const activeTip = tips.querySelector<HTMLDivElement>(':scope > .tip.active')
  activeTip.classList.remove('active')
  if (tipElements[next] === activeTip) {
    next = (next + 1) % tipElements.length
  }
  tipElements[next].classList.add('active')
}

let timer: number | undefined = setInterval(() => {
  startTime = Date.now()
  activeTip()
}, 10 * 1000) as unknown as number

tipElements
  .forEach(tip => {
    tip.addEventListener('mouseenter', () => {
      clearInterval(timer)
      endTime = Date.now()
    })
    tip.addEventListener('mouseleave', () => {
      timer = setInterval(() => {
        startTime = Date.now()
        activeTip()
      }, 10 * 1000 - (endTime - startTime)) as unknown as number
    })
  })
