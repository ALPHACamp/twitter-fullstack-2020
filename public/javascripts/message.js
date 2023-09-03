const alertElement = document.getElementById('alert')
    if (alertElement.style.display !== 'none') {
      setTimeout(() => {
        alertElement.style.display = 'none'
      }, 3000)
    }

const submitButton = document.querySelector('#reply-button')
const form  = document.querySelector('.needs-validation')
const replyComment = document.querySelector('#reply-comment')
submitButton.addEventListener('click', function onSubmitButtonClicked(event) {
  // console.log(event.target)
	if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }
  form.classList.add('was-validated')
  replyComment.classList.add('is-invalid')
})