import './tabs.client.scss'

document.querySelectorAll<HTMLDivElement>('.docs-tabs').forEach(tabs => {
  const header = tabs.querySelector('.docs-tabs__header')
  const headerItems = header.querySelectorAll('.docs-tabs__header-item')
  header.querySelectorAll('.docs-tabs__header-item').forEach((item, index) => {
    item.addEventListener('click', () => {
      headerItems.forEach(item => item.classList.remove('active'))
      item.classList.add('active')
      tabs.style.setProperty('--active-index', index.toString())
    })
  })
})
