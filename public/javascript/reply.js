const replySubmitButton = document.querySelector('#reply-submit-button')
const replyForm = document.querySelector('#reply-form')
const replyFeedback = document.querySelector('.reply-feedback')
const replyClose = document.querySelector('#reply-close')
const replyArea = document.querySelector('#comment')

const MAX_COMMENT_COUNT = 140

replySubmitButton.addEventListener('click', event => {
  replyForm.classList.add('was-validated')
})

replyForm.addEventListener('submit', event => {
  if (!replyForm.checkValidity()) {
    event.stopPropagation()
    event.preventDefault()
  }
})

replyForm.addEventListener('input', event => {
  const { target } = event
  const content = target.value
  // reply
  checkReplyValid(target, content, MAX_COMMENT_COUNT)
})

replyClose.addEventListener('click', event => {
  // 關掉modal時清空錯誤訊息和textarea
  replyFeedback.innerText = ''
  replyArea.value = ''
})

function checkReplyValid (target, content, mexLength) {
  // 如果內容只有空白或換行
  if (content.trim().length === 0) {
    replyFeedback.innerText = '內容不可空白'
    target.setCustomValidity('內容不可空白')
  } else if (content.length > mexLength) {
    replyFeedback.innerHTML = `字數不可超過${mexLength}字`
    target.setCustomValidity(`字數不可超過${mexLength}字`)
  } else {
    target.setCustomValidity('')
  }
}
