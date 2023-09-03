const passwordInput = document.querySelector('#password')
const checkPasswordInput = document.querySelector('#checkPassword')
const messageForPassword = document.querySelector('.message-for-password')
const messageForCheckedPassword = document.querySelector('.message-for-check-password')

function updateMessage (element, color, message) {
  element.style.color = color
  element.textContent = message
}

function checkPasswordMach (password, checkPassword, messageElement) {
  if (!password.trim()) {
    updateMessage(messageElement, '', '')
  } else if (password === checkPassword) {
    updateMessage(messageElement, '#3DD598', '密碼與確認密碼相符')
  } else {
    updateMessage(messageElement, '#FC5A5A', '密碼與確認密碼不相符')
  }
}

function validatePasswords () {
  const password = passwordInput.value
  const checkPassword = checkPasswordInput.value

  checkPasswordMach(password, checkPassword, messageForPassword)
  checkPasswordMach(checkPassword, password, messageForCheckedPassword)
}

passwordInput.addEventListener('input', validatePasswords)
checkPasswordInput.addEventListener('input', validatePasswords)
