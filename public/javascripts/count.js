function calNameWords () {
  const length = document.getElementById('edit-name').value.length
  document.getElementById('edit-name-value').innerHTML = length
  if (length > 50) {
    document.getElementById('edit-name-error').innerHTML = '名稱字數超出上限！'
    document.querySelector('#edit-name').classList.add('error-display')
  } else {
    document.getElementById('edit-name-error').innerHTML = ''
    document.querySelector('#edit-name').classList.remove('error-display')
  }
}
function calIntroductionWords () {
  const length = document.getElementById('edit-introduction').value.length
  document.getElementById('edit-introduction-value').innerHTML = length
  if (length > 160) {
    document.getElementById('edit-introduction-error').innerHTML = '自我介紹字數超出上限！'
    document.querySelector('#edit-introduction').classList.add('error-display')
  } else {
    document.getElementById('edit-introduction-error').innerHTML = ''
    document.querySelector('#edit-introduction').classList.remove('error-display')
  }
}

const accountMessageLength = document.querySelector('.account-messages').innerHTML.length
const nameMessageLength = document.querySelector('.name-messages').innerHTML.length
const emailMessageLength = document.querySelector('.email-messages').innerHTML.length
const passwordMessageLength = document.querySelector('.password-messages').innerHTML.length
const checkPasswordMessageLength = document.querySelector('.checkPassword-messages').innerHTML.length
if (accountMessageLength > 0) {
  document.querySelector('#setting-account').classList.add('error-display')
} else {
  document.querySelector('#setting-account').classList.remove('error-display')
}
if (nameMessageLength > 0) {
  document.querySelector('#setting-name').classList.add('error-display')
} else {
  document.querySelector('#setting-name').classList.remove('error-display')
}
if (emailMessageLength > 0) {
  document.querySelector('#setting-email').classList.add('error-display')
} else {
  document.querySelector('#setting-email').classList.remove('error-display')
}
if (passwordMessageLength > 0) {
  document.querySelector('#setting-password').classList.add('error-display')
} else {
  document.querySelector('#setting-password').classList.remove('error-display')
}
if (checkPasswordMessageLength > 0) {
  document.querySelector('#setting-checkPassword').classList.add('error-display')
} else {
  document.querySelector('#setting-checkPassword').classList.remove('error-display')
}
