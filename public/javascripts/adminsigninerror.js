const adminAccount = document.querySelector('.admin-account-message').innerHTML
const adminPassword = document.querySelector('.admin-password-message').innerHTML

if (adminAccount.trim()) {
  document.querySelector('#admin-account').classList.add('error-display')
} else {
  document.querySelector('#admin-account').classList.remove('error-display')
}

if (adminPassword.trim()) {
  document.querySelector('#admin-password').classList.add('error-display')
} else {
  document.querySelector('#admin-password').classList.remove('error-display')
}
