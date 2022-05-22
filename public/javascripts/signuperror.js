const signupAccount = document.querySelector('.signup-account-message').innerHTML
const signupName = document.querySelector('.signup-name-message').innerHTML
const signupEmail = document.querySelector('.signup-email-message').innerHTML
const signupPassword = document.querySelector('.signup-password-message').innerHTML
const signupCheckpassword = document.querySelector('.signup-checkPasswor-message').innerHTML

if (signupAccount.trim()) {
  document.querySelector('#signup-account').classList.add('error-display')
} else {
  document.querySelector('#signup-account').classList.remove('error-display')
}

if (signupName.trim()) {
  document.querySelector('#signup-name').classList.add('error-display')
} else {
  document.querySelector('#signup-name').classList.remove('error-display')
}

if (signupEmail.trim()) {
  document.querySelector('#signup-email').classList.add('error-display')
} else {
  document.querySelector('#signup-email').classList.remove('error-display')
}

if (signupPassword.trim()) {
  document.querySelector('#signup-password').classList.add('error-display')
} else {
  document.querySelector('#signup-password').classList.remove('error-display')
}

if (signupCheckpassword.trim()) {
  document.querySelector('#signup-checkPassword').classList.add('error-display')
} else {
  document.querySelector('#signup-checkPassword').classList.remove('error-display')
}
