const BASE_URL = document.querySelector('#BASE-URL').textContent

setTimeout(() => {
  document.querySelector('.flash')?.classList.add('cb')
  setTimeout(() => { document.querySelector('.flash')?.classList.remove('cb') },
    2800)
}, 500)
