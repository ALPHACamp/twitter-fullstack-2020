for (let i = 1; i <= 2; i++) {
  const submitBtn = document.getElementById(`submitBtn${i}`)
  const contentInput = document.getElementById(`contentInput${i}`)
  const contentMessage = document.getElementById(`contentMessage${i}`)

  if (submitBtn) {
    submitBtn.addEventListener('click', function (event) {
      if (contentInput.value.trim() === '') {
        contentMessage.textContent = '內容不可空白'
        event.preventDefault()
      } else {
        contentMessage.textContent = ''
      }
      if (contentInput.value.length > 140) {
        contentMessage.textContent = '字數不可超過 140 字'
        event.preventDefault()
      }
    })
  }
}

document.querySelectorAll('[id^=submitBtn]').forEach(btn => {
  const id = btn.getAttribute('data-id')
  const contentInput = document.querySelector(`#contentInput${id}`)
  const contentMessage = document.querySelector(`#contentMessage${id}`)
  btn.addEventListener('click', function (event) {
    if (contentInput.value.trim() === '') {
      contentMessage.textContent = '內容不可空白'
      event.preventDefault()
    } else {
      contentMessage.textContent = ''
    }
    if (contentInput.value.length > 50) {
      contentMessage.textContent = '字數不可超過 50 字'
      event.preventDefault()
    }
  })
})
