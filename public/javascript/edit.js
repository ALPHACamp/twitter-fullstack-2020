const form = document.querySelector('#edit-form')
const input = document.querySelectorAll('input')
const button = document.querySelector('.save-btn')

// 取得完整的URL
const url = window.location.href

// 使用正則表達式從URL中匹配數字
const matches = url.match(/\/(\d+)/)

// 取得匹配結果中的數字
const userId = matches[1]

const inputValue = {}

button.addEventListener('click', event => {
  form.classList.add('validated')
  input.forEach(item => {
    inputValue[item.name] = item.value
    if (item.value) {
      return item.setCustomValidity('')
    }
  })
  axios
    .post(`/api/users/${userId}`, inputValue)
    // json資料
    .then(res => {
      res.data.forEach(data => {
        if (data.status === 'error' || !form.checkValidity()) {
          return input.forEach(item => {
            if (item.name === data.name) {
              item.nextElementSibling.innerText = data.messages
              item.setCustomValidity('error')
            }
          })
        } else {
          return input.forEach(item => {
            item.nextElementSibling.innerText = ''
          })
        }
      })
    })
    .then(() => {
      if (form.checkValidity()) form.submit()
    })
    .catch(err => {
      console.log(err)
    })
})

form.addEventListener('submit', event => {
  event.stopPropagation()
  event.preventDefault()
})
