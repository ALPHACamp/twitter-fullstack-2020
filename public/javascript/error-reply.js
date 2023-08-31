const submitBtn = document.getElementById('submitBtn2')
const contentInput = document.getElementById('contentInput2')
const contentMessage = document.getElementById('contentMessage2')

submitBtn.addEventListener('click', function (event) {
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
