const dataPanel = document.querySelector('#data-panel')
console.log(dataPanel)
dataPanel.addEventListener('click', (event) => {
  if (event.target.matches('.btn-reply')) {
    const id = event.target.dataset.id
    console.log(event.target.dataset.id)  // 修改這裡
  }
})