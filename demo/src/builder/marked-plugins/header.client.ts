import './header.client.scss'
document.querySelectorAll<HTMLDivElement>('.anchor-point')
  .forEach(ele => {
    const hash = window.location.hash
    if (hash) {
      document.querySelector(hash)?.scrollIntoView({
        behavior: 'smooth'
      })
    }
  })
