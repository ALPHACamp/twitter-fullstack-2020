document.addEventListener('DOMContentLoaded', function () {
  const submitButton = document.getElementById('submitBtn')
  const contentInput = document.getElementById('contentInput')
  const emptyContentMessage = document.getElementById('emptyContentMessage')

  submitButton.addEventListener('click', function () {
    if (contentInput.value.trim() === '') {
      emptyContentMessage.textContent = '内容不能为空，不可提交'
    } else {
      emptyContentMessage.textContent = '' // 清除提示信息
      // 进行其他提交逻辑
    }
  })
})

// document.addEventListener('DOMContentLoaded', function () {
//   const submitButton = document.getElementById('submitBtnTest')
//   const contentInput = document.getElementById('contentInputTest')

//   submitButton.addEventListener('click', function () {
//     contentInput.textContent = '内容不能为空，不可提交'

//     // if (contentInput.value.trim() === '') {
//     //   emptyContentMessage.textContent = '内容不能为空，不可提交'
//     // } else {
//     //   emptyContentMessage.textContent = '' // 清除提示信息
//     //   // 进行其他提交逻辑
//     // }
//   })
// })
