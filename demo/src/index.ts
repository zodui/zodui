const main = document.querySelector('body > main')

console.log(main)
// watch scroll
main.addEventListener('scroll', e => {
  const progress = main.scrollTop / (main.scrollHeight - main.clientHeight)
  console.log(progress)
})
