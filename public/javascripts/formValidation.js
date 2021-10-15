const accountInput = document.querySelector('.account-input')
const accountNotice = document.querySelector('.form-account-notice')
const emailInput = document.querySelector('.email-input')
const emailNotice = document.querySelector('.form-email-notice')
const passwordInput = document.querySelector('.password-input')
const passwordCheckInput = document.querySelector('.passwordCheck-input')
const passwordNotice = document.querySelector('.form-password-notice')
const formButton = document.querySelector('.form-button')


if (accountInput) {
  accountInput.addEventListener('blur', (event) => {
    const account = event.target.value
    if (!account) {
      accountNotice.className = 'form-account-notice-invalid'
      accountNotice.innerHTML = '帳號不可以為空'
      return
    }
    axios.get(`https://alphitter-turagon.herokuapp.com/signup/${account}`)
    .then(response => {
      if (response.data === 'true') {
        accountNotice.className = 'form-account-notice-valid'
        accountNotice.innerHTML = '此帳號可用'
      } else {
        accountNotice.className = 'form-account-notice-invalid'
        accountNotice.innerHTML = '此帳號已有人使用'
      }
    })
  })
}

if (accountInput) {
  accountInput.addEventListener('focus', (event) => {
    accountNotice.className = 'form-account-notice'
  })
}

if (emailInput) {
  emailInput.addEventListener('blur', (event) => {
    const email = event.target.value
    if (!emailVerify(email)) {
      emailNotice.className = 'form-email-notice-validated'
    }
  })
}

if (formButton) {
  formButton.addEventListener('click', (event) => {
    if (passwordInput.value !== passwordCheckInput.value) {
      event.preventDefault()
      passwordNotice.className = 'form-password-notice-validated'
    }
  })
}

function emailVerify(email) {
  const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
  return emailRule.test(email) ? true : false
}