const body = document.querySelector('body')
const modal = document.querySelectorAll('.modal')
const modalReply = document.querySelector('#modal-reply')

// // 全畫面監聽器
body.addEventListener('click', (event) => {
  let target = event.target

  if (target.classList.contains('close') || target.classList.contains('mask')) {
    // 點擊X icon關閉，另可點擊modal對話框以外地方關閉
    Array.from(modal).map((el) => {
      el.classList = 'modal d-none'
    })
  } else if (target.classList.contains('commenting')) {
    // 如果按下個別"回覆"icon，開啟 replying modal
    // axios here to get tweet info
    modalReply.classList.remove('d-none')
  }
})

// const inputs = document.querySelectorAll('input')
// console.log(inputs)
// if (inputs.length) {
//   inputs.map((input) => {
//     input.addEventListener('input', (event) => {
//       if (!input.checkValidity()) {
//         input.classList.add('invalid')
//         if (input.validity.valueMissing) {
//           input.setCumstomValidity("內容不可為空白")
//         }
//       }
//     })
//   })
// }