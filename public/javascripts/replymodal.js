// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
        form.classList.add('was-validated')
      }, false)
    })
})()

const btnClose = document.getElementById('closeReply')
btnClose.addEventListener('click', function (event) {
  event.target.nextElementSibling.nextElementSibling.lastElementChild.classList.remove('was-validated')
})

function calPostWords () {
  const length = document.getElementById('description').value.length
  console.log('length:', length)
  if (length > 140) {
    document.getElementById('post-error').innerText = '字數不可超過140字'
    document.getElementById('post-error').classList.add('display')
  } else {
    document.getElementById('post-error').innerText = '內容不可為空白'
    document.getElementById('post-error').classList.remove('display')
  }
}
