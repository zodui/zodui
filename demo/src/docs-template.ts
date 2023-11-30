(() => {
  const main = document.body.querySelector<HTMLDivElement>(':scope > main')
  const quickOperates = main.querySelector<HTMLDivElement>(':scope > .quick-operates')

  const backToTop = quickOperates?.querySelector<HTMLDivElement>(':scope > .back-to-top')
  const goToComments = quickOperates?.querySelector<HTMLDivElement>(':scope > .go-to-comments')

  main.addEventListener('scroll', () => {
    const isTop = main.scrollTop < 10
    backToTop?.classList.toggle('hide', isTop)
  })
  backToTop?.addEventListener('click', () => {
    main.scrollTop = 0
  })
  goToComments?.addEventListener('click', () => {
    const comments = document.querySelector<HTMLDivElement>('.utterances')
    comments?.scrollIntoView({
      behavior: 'smooth'
    })
  })
})()
