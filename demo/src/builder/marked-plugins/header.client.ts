import './header.client.scss'

const hash = decodeURIComponent(location.hash)
document.querySelectorAll<HTMLDivElement>('.anchor-point')
  .forEach(e => {
    const id = e.id
    if (hash && id === hash.slice(1)) {
      document.querySelector(hash)?.scrollIntoView({
        behavior: 'smooth'
      })
    }
  })
