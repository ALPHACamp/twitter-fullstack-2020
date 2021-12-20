//留言
const comment = document.querySelector('#comment-modal')
const replyButton = document.querySelector('#replybtn')

comment.addEventListener('input', function check(event) {
  if (comment.value.length < 1) {
    comment.classList.add('is-invalid')
    comment.nextElementSibling.innerHTML = "內容不可為空白"
  }
  if (comment.value.length > 1) {
    comment.classList.remove('is-invalid')
  }
})

replyButton.addEventListener('click', function check(event) {
  if (comment.value.length < 1) {
    comment.classList.add('is-invalid')
    comment.nextElementSibling.innerHTML = "內容不可為空白"
    event.preventDefault()
  }
})
