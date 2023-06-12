const replySubmitButtons = document.querySelectorAll('#reply-submit-button')
const replyForms = document.querySelectorAll('#reply-form')
const replyFeedbacks = document.querySelectorAll('.reply-feedback')
const replyCloses = document.querySelectorAll('#reply-close')
const replyAreas = document.querySelectorAll('#comment')

const MAX_COMMENT_COUNT = 140

replySubmitButtons.forEach((replySubmitButton, index) => {
  replySubmitButton.addEventListener('click', event => {
    replyForms[index].classList.add('was-validated')
  })
})

replyForms.forEach(replyForm => {
  replyForm.addEventListener('submit', event => {
    if (!replyForm.checkValidity()) {
      event.stopPropagation()
      event.preventDefault()
    }
  })
})

replyForms.forEach((replyForm, index) => {
  replyForm.addEventListener('input', event => {
    const { target } = event
    const content = target.value
    // reply
    checkReplyValid(target, content, MAX_COMMENT_COUNT, index)
  })
})

replyCloses.forEach((replyClose, index) => {
  replyClose.addEventListener('click', event => {
    // 關掉modal時清空錯誤訊息和textarea
    replyFeedbacks[index].innerText = ''
    replyAreas[index].value = ''
  })
})

function checkReplyValid (target, content, maxLength, index) {
  // 如果內容只有空白或換行
  if (content.trim().length === 0) {
    target.setCustomValidity('內容不可空白')
    replyFeedbacks[index].innerText = target.validationMessage
  } else if (content.length > maxLength) {
    target.setCustomValidity(`字數不可超過${maxLength}字`)
    replyFeedbacks[index].innerText = target.validationMessage
  } else {
    target.setCustomValidity('')
  }
}
