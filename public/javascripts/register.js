//form validation from front-end
const form = document.querySelector('#form')
const submitButton = document.querySelector('#submit')

submitButton.addEventListener('click', function onSubmitClick() {
  form.classList.add('was-validated')
})

form.addEventListener('submit', function onFormSubmit() {
  if (!form.checkValidity()) {
    event.preventDefault()
    event.stopPropagation()
  }
})
