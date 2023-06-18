const form = document.querySelector('.form-signup')
const nameInput = document.querySelector('#name')
const passwordInput = document.querySelector('#password')
const checkPasswordInput = document.querySelector('#checkPassword')
const submitBtn = document.querySelector('#btn-signin-signup-submit')

submitBtn.addEventListener('submit', function onButtonSubmit (event) {
  form.classList.add('valided')
})

form.addEventListener('sumbit', function onFormSubmit (event) {
  if (!form.checkVisibility()) {
    event.preventDefault()
    event.stopPropagation()
  }
})

nameInput.addEventListener('keyup', function checkNameLength () {
  const formInput = nameInput.parentElement.lastElementChild
  if (nameInput.value.length > 50) {
    nameInput.setCustomValidity('名稱不得超過50字')
    formInput.innerText = '名稱不得超過50字'
    nameInput.classList.add('invalid')
  } else {
    nameInput.setCustomValidity('')
    formInput.innerText = ''
    nameInput.classList.remove('invalid')
  }
})

checkPasswordInput.addEventListener('keyup', function checkPassword () {
  const formInput = checkPasswordInput.parentElement.lastElementChild
  if (passwordInput.value !== checkPasswordInput.value) {
    checkPasswordInput.setCustomValidity('密碼不相同')
    formInput.innerText = '密碼不相同'
    checkPasswordInput.classList.add('invalid')
  } else {
    checkPasswordInput.setCustomValidity('')
    formInput.innerText = ''
    checkPasswordInput.classList.remove('invalid')
  }
})
