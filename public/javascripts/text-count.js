const textCountBtn = document.querySelectorAll('.text-count-btn')
const textCountArea = document.querySelectorAll('.text-count-area')
const textCountNumber = document.querySelectorAll('.text-count-number')
const textAlertEmpty = document.querySelectorAll('.text-alert-empty')
const textAlertOver = document.querySelectorAll('.text-alert-over')

textCountArea.forEach((textArea, i) => {
  textArea.addEventListener('keyup', e => textCount(e, textCountBtn[i], textCountNumber[i], textAlertEmpty[i], textAlertOver[i]))
})

function textCount (e, submitBtn, textNumber, alertEmpty, alertOver) {
  submitBtn = submitBtn || ''
  textNumber = textNumber || ''
  alertEmpty = alertEmpty || ''
  alertOver = alertOver || ''
  const target = e.target
  const maxLength = target.getAttribute('maxlength')
  const currentText = target.value.trim()
  const currentLength = currentText ? target.value.length : 0
  if (currentLength > 0 || currentLength <= maxLength) {
    submitBtn.removeAttribute('disabled')
    alertEmpty.classList.add('d-none')
    alertOver.classList.remove('d-block')
  }
  if (currentLength === 0) {
    submitBtn.setAttribute('disabled', '')
    alertEmpty.classList.remove('d-none')
  }
  if (currentLength === 140) {
    alertOver.classList.add('d-block')
  }
  textNumber.textContent = currentLength
}
