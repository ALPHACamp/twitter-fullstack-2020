// const submitBtn3 = document.getElementById('submitBtn3')
// const contentInput3 = document.getElementById('contentInput3')
// const contentMessage3 = document.getElementById('contentMessage3')

// console.log(submitBtn3)
// console.log(contentInput3)
// console.log(contentMessage3)

// contentInput3.addEventListener('change', function (event) {
//   const newValue = event.target.value
//   contentMessage3.textContent = `新的${newValue}`

// if (contentInput3.value.trim() === '') {
//   contentMessage3.textContent = '內容不可空白'
//   event.preventDefault()
// } else {
//   contentMessage3.textContent = ''
// }
// if (contentInput3.value.length > 140) {
//   contentMessage3.textContent = '字數不可超過 140 字'
//   event.preventDefault()
// }
// })

new Array(50).fill(0).forEach((value, index) => {
  const submitBtn = document.querySelector(`#submitBtn${index + 1}`)
  const contentInput = document.querySelector(`#contentInput${index + 1}`)
  const contentMessage = document.querySelector(`#contentMessage${index + 1}`)

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
})
