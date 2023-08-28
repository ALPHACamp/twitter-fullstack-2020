// document.addEventListener('DOMContentLoaded', function () { })
const submitBtn2 = document.getElementById('submitBtn2')
const contentInput2 = document.getElementById('contentInput2')
const contentMessage2 = document.getElementById('contentMessage2')

submitBtn2.addEventListener('click', function (event) {
  if (contentInput2.value.trim() === '') {
    contentMessage2.textContent = '內容不可空白'
    event.preventDefault()
  } else {
    contentMessage2.textContent = ''
  }
  if (contentInput2.value.length > 140) {
    contentMessage2.textContent = '字數不可超過 140 字'
    event.preventDefault()
  }
})
