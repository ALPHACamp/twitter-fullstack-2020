for (let i = 1; i <= 2; i++) {
  const submitBtn = document.getElementById(`submitBtn${i}`)
  const contentInput = document.getElementById(`contentInput${i}`)
  const contentMessage = document.getElementById(`contentMessage${i}`)

  if (submitBtn) {
    submitBtn.addEventListener('click', function (event) {
      if (contentInput.value.trim() === '') {
        contentMessage.textContent = '內容不可空白'
        event.preventDefault()
      } else {
        contentMessage.textContent = ''
      }
      if (contentInput.value.length > 140) {
        contentMessage.textContent = '字數不可超過 140 字'
        event.preventDefault()
      }
    })
  }
}

document.querySelectorAll('[id^=submitBtn]').forEach(btn => {
  const id = btn.getAttribute('data-id')
  const contentInput = document.querySelector(`#contentInput${id}`)
  const contentMessage = document.querySelector(`#contentMessage${id}`)
  btn.addEventListener('click', function (event) {
    if (contentInput.value.trim() === '') {
      contentMessage.textContent = '內容不可空白'
      event.preventDefault()
    } else {
      contentMessage.textContent = ''
    }
    if (contentInput.value.length > 50) {
      contentMessage.textContent = '字數不可超過 50 字'
      event.preventDefault()
    }
  })
})

const forms = document.querySelectorAll('.needs-validation')
const account = document.querySelector('#account')
const name = document.querySelector('#name')
const email = document.querySelector('#email')
const password = document.querySelector('#password')
const checkPassword = document.querySelector('#checkPassword')
const introduction = document.querySelector('#introduction')

Array.from(forms).forEach(form => {
  form.addEventListener('submit', event => {
    if (account) {
      if (account.value.trim().length === 0) {
        account.classList.remove('is-valid')
        account.classList.add('is-invalid')
        event.preventDefault()
      } else {
        account.classList.add('is-valid')
        account.classList.remove('is-invalid')
      }
    }
    if (name) {
      if (name.value.trim().length === 0 || name.value.length > 50) {
        name.classList.remove('is-valid')
        name.classList.add('is-invalid')
        event.preventDefault()
      } else {
        name.classList.add('is-valid')
        name.classList.remove('is-invalid')
      }
    }
    if (email) {
      if (email.value.trim().length === 0) {
        email.classList.remove('is-valid')
        email.classList.add('is-invalid')
        event.preventDefault()
      } else {
        email.classList.add('is-valid')
        email.classList.remove('is-invalid')
      }
    }
    if (password) {
      if (password.nextElementSibling.id !== 'editForm') {
        if (password.value.trim().length === 0) {
          password.classList.remove('is-valid')
          password.classList.add('is-invalid')
          event.preventDefault()
        } else {
          password.classList.add('is-valid')
          password.classList.remove('is-invalid')
        }
      }
    }
    if (checkPassword) {
      if (checkPassword.nextElementSibling.id !== 'editForm') {
        if (checkPassword.value.trim().length === 0) {
          checkPassword.classList.remove('is-valid')
          checkPassword.classList.add('is-invalid')
          event.preventDefault()
        } else {
          checkPassword.classList.add('is-valid')
          checkPassword.classList.remove('is-invalid')
        }
      }
    }
    if (introduction) {
      if (introduction.value.length > 160) {
        introduction.classList.remove('is-valid')
        introduction.classList.add('is-invalid')
        event.preventDefault()
      } else {
        introduction.classList.add('is-valid')
        introduction.classList.remove('is-invalid')
      }
    }
  }, false)
})
