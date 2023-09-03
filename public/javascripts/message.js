const alertElement = document.getElementById('alert')
    if (alertElement.style.display !== 'none') {
      setTimeout(() => {
        alertElement.style.display = 'none'
      }, 3000)
    }


//reply-modal監聽
const forms  = document.querySelectorAll('.needs-validation')
Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
