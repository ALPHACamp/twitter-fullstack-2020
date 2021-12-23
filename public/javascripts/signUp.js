const account = document.querySelector("#account")
const signUpName = document.querySelector("#name")
const email = document.querySelector("#email")
const password = document.querySelector("#password")
const checkPassword = document.querySelector("#checkPassword")
const signUpButton = document.querySelector(".signup-button")

account.addEventListener('input', function check(event) {
  if (account.value.length > 0) {
    account.classList.remove('is-invalid')
  }
})

signUpName.addEventListener('input', function check(event) {
  if (signUpName.value.length > 50) {
    signUpName.classList.add('is-invalid')
    signUpName.nextElementSibling.innerHTML = "名稱不可超過50字"
  }
  if (signUpName.value.length > 0 && signUpName.value.length < 50) {
    signUpName.classList.remove('is-invalid')
  }
})

email.addEventListener('input', function check(event) {
  if (email.value.length > 0) {
    email.classList.remove('is-invalid')
  }
})

password.addEventListener('input', function check(event) {
  if (password.value.length > 0) {
    password.classList.remove('is-invalid')
  }
})

checkPassword.addEventListener('input', function check(event) {
  if (checkPassword.value.length > 0) {
    checkPassword.classList.remove('is-invalid')
  }
})


signUpButton.addEventListener("click", function check(event) {
  if (account.value.length < 1) {
    account.classList.add('is-invalid')
    account.nextElementSibling.innerHTML = "帳號為必填欄位"
    event.preventDefault()
  }
  if (signUpName.value.length < 1) {
    signUpName.classList.add('is-invalid')
    signUpName.nextElementSibling.innerHTML = "名稱為必填欄位"
    event.preventDefault()
  }
  if (email.value.length < 1) {
    email.classList.add('is-invalid')
    email.nextElementSibling.innerHTML = "信箱為必填欄位"
    event.preventDefault()
  }
  if (password.value.length < 1) {
    password.classList.add('is-invalid')
    password.nextElementSibling.innerHTML = "密碼不可為空"
    event.preventDefault()
  }
  if (password.value !== checkPassword.value) {
    checkPassword.classList.add('is-invalid')
    checkPassword.nextElementSibling.innerHTML = "確認密碼與密碼不相符"
    event.preventDefault()
  }
})