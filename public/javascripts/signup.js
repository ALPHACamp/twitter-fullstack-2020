const form = document.querySelector('#form')
const submitButton = document.querySelector('#submit')
const accountInput = document.querySelector('#account')
const nameInput = document.querySelector('#name')
const passwordInput = document.querySelector('#password')
const confirmPasswordInput = document.querySelector('#checkPassword')

// Submit
submitButton.addEventListener('click', function onSubmitClick (event) {
  form.classList.add('was-validated')
})

form.addEventListener('submit', function onFormSubmit (event) {
  if (!form.checkValidity()) {
    event.preventDefault()
    event.stopPropagation()
  }
})

// Account
accountInput.addEventListener('keyup', function countLetters (event) {
  const target = event.target
  const counter = target.parentElement.lastElementChild
  counter.innerText = `${target.value.length}/10`
})

accountInput.addEventListener('keyup', function onInputKeyUp (event) {
  if (event.target.value.length > 10) {
    event.target.setCustomValidity('Invalid field.')
  } else {
    event.target.setCustomValidity('')
  }
})

// Name
nameInput.addEventListener('keyup', function countLetters (event) {
  const target = event.target
  const counter = target.parentElement.lastElementChild
  counter.innerText = `${target.value.length}/50`
})

nameInput.addEventListener('keyup', function onInputKeyUp (event) {
  if (event.target.value.length > 50) {
    event.target.setCustomValidity('Invalid field.')
  } else {
    event.target.setCustomValidity('')
  }
})

// Confirm Password
confirmPasswordInput.addEventListener('keyup', function checkpassword (event) {
  if (passwordInput.value !== confirmPasswordInput.value) {
    event.target.setCustomValidity('Invalid field.')
  } else {
    event.target.setCustomValidity('')
  }
})
