import './copy.client.scss'

document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const text = btn.getAttribute('data-clipboard-text')
    if (!text) return
    navigator.clipboard.writeText(text)
  })
})
