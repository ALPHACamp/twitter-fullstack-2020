// document.addEventListener('DOMContentLoaded', function () {
const submitBtn = document.getElementById('submitBtn')
const contentInput = document.getElementById('contentInput')
const contentMessage = document.getElementById('emptyContentMessage')

// const replySubmitBtn = document.querySelectorAll('.replySubmitBtn')
// const replyContentInput = document.querySelectorAll('.replyContentInput')
// const replyEmptyContentMessage = document.querySelectorAll('.replyEmptyContentMessage')
// console.log(replyEmptyContentMessage)

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

// replySubmitBtn[0].addEventListener('click', function (event) {
//   if (replyContentInput[0].value.trim() === '') {
//     replyEmptyContentMessage[0].textContent = '內容不可空白'
//     event.preventDefault()
//   } else {
//     replyEmptyContentMessage.textContent = ''
//   }
//   if (replyContentInput.value.length > 140) {
//     replyEmptyContentMessage.textContent = '字數不可超過 140 字'
//     event.preventDefault()
//   }
// })
// })
