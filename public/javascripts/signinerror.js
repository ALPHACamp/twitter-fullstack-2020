const accountLength = document.querySelector('.account-length').innerHTML

const passwordLength = document.querySelector('.password-length').innerHTML

if (accountLength.trim()) {
  document.querySelector('#signin-account').classList.add('error-display')
} else {
  document.querySelector('#signin-account').classList.remove('error-display')
}

if (passwordLength.trim()) {
  document.querySelector('#signin-password').classList.add('error-display')
} else {
  document.querySelector('#signin-password').classList.remove('error-display')
}
