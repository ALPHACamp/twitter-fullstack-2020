const sidePostSubmitBtn = document.querySelector('.side-post-btn')
const sidePostSubmitArea = document.querySelector('.side-post-description')
const sidePostSpan = document.querySelector('.side-post-number')

const homePostSubmitBtn = document.querySelector('.home-post-btn')
const homePostSubmitArea = document.querySelector('.home-post-description')
const homePostSpan = document.querySelector('.home-post-number')

sidePostSubmitArea.addEventListener('keyup', e => textCount(e, sidePostSubmitBtn, sidePostSpan))
homePostSubmitArea.addEventListener('keyup', e => textCount(e, homePostSubmitBtn, homePostSpan))

function textCount (e, submitBtn, textNumber) {
  submitBtn = submitBtn || ''
  textNumber = textNumber || ''
  const target = e.target
  const maxLength = target.getAttribute('maxlength')
  const currentText = target.value.trim()
  const currentLength = currentText ? target.value.length : 0
  if (currentLength > 0 || currentLength <= maxLength) {
    submitBtn.removeAttribute('disabled')
  }
  if (currentLength === 0) {
    submitBtn.setAttribute('disabled', '')
  }
  textNumber.textContent = currentLength
}
