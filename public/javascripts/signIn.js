const account = document.querySelector("#account")
const password = document.querySelector("#password")
const signInButton = document.querySelector(".siginin-button")

account.addEventListener('input', function check(event) {
  if (account.value.length > 0) {
    account.classList.remove('is-invalid')
  }
})

password.addEventListener('input', function check(event) {
  if (password.value.length > 0) {
    password.classList.remove('is-invalid')
  }
})
signInButton.addEventListener("click", function check(event) {
  if (password.value.length < 1) {
    password.classList.add("is-invalid")
    password.nextElementSibling.innerHTML = "密碼不可為空白"
    event.preventDefault()
  }
  if (account.value.length < 1) {
    account.classList.add('is-invalid')
    account.nextElementSibling.innerHTML = "帳號不可為空白"
    event.preventDefault()
  }
})