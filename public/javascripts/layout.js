// const body = document.querySelector('body')
// const modal = document.querySelectorAll('.modal')

// const home = document.querySelector('#homing')
// const edit = document.querySelector('#editing')
// const set = document.querySelector('#setting')
// const post = document.querySelector('#posting')

// const modalPost = document.querySelector('#modal-post')
// const modalReply = document.querySelector('#modal-reply')
// const modalEdit = document.querySelector('#modal-edit')

// const modalNameInput = document.querySelector('#name')
// const modalNameCounter = document.querySelector('#name-counter')

// const modalIntroTextarea = document.querySelector('#introduction')
// const modalIntroCounter = document.querySelector('#introduction-counter')

// let previousActive

// // 專用於navigation的a標籤切換active (<a>本身及其下<i> icon)
// function toggleActive(onNode, offNode) {
//   offNode.classList = ''
//   offNode.firstElementChild.classList.remove('active')
//   onNode.classList = 'active'
//   onNode.firstElementChild.classList.add('active')
// }

// // 全畫面監聽器
// body.addEventListener('click', (event) => {
//   let target = event.target

//   if (target.id === 'posting') {
//     // 如果按下"推文"，開啟 posting modal
//     modalPost.classList.remove('d-none')

//   } else if (target.classList.contains('commenting')) {
//     // 如果按下個別"回覆"icon，開啟 replying modal
//     // axios here to get tweet info
//     modalReply.classList.remove('d-none')

//   } else if (target.id === 'editing') {
//     // 如果按下"個人資料"，修改按鈕active狀態
//     [previousActive] = [home, set]
//       .filter((el) => el.classList.contains('active'))
//     toggleActive(edit, previousActive)

//     // 開啟 editing modal
//     modalEdit.classList.remove('d-none')

//   } else if (target.classList.contains('close') || target.classList.contains('mask')) {
//     // 點擊X icon關閉，另可點擊modal對話框以外地方關閉
//     Array.from(modal).map((el) => {
//       el.classList = 'modal d-none'
//     })
//     // 在開啟editing modal後，需恢復原狀
//     if (edit.classList.contains('active')) {
//       toggleActive(previousActive, edit)
//     }
//   }
// })

// // editing modal 字數計數
// modalNameInput.addEventListener('keyup', (event) => {
//   modalNameCounter.textContent = `${event.target.value.length}/50`
// })

// modalIntroTextarea.addEventListener('keyup', (event) => {
//   modalIntroCounter.textContent = `${event.target.value.length}/160`
// })

const inputs = document.querySelectorAll('input')
if (inputs.length) {
  inputs.map((input) => {
    input.addEventListener('input', (event) => {
      if (!input.checkValidity()) {
        input.classList.add('invalid')
        if (input.validity.valueMissing) {
          input.setCumstomValidity("內容不可為空白")
        }
      }
    })
  })
}