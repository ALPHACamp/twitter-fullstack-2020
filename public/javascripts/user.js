const userEditBtn = document.querySelector('.user-edit-modal-button')
const userEditModal = document.querySelector('#user-edit-modal-dialog')
const saveBtn = document.querySelector('.user-edit-save-button')

const userName = document.querySelector('#user-edit-modal-name')
const userNameCounts = document.querySelector('.user-edit-modal-name-counts')
const userIntroduction = document.querySelector('#user-edit-modal-introduction')
const userIntroductionCounts = document.querySelector('.user-edit-modal-introduction-counts')

// 點擊 "編輯個人按鈕" 計算顯示的字數
userEditBtn.addEventListener('click', e => {
  userNameCounts.innerText = userName.value.length
  userIntroductionCounts.innerText = userIntroduction.value.length
})

// 在此抓取的 target 只有 input 或 textarea 有 keyup 功能
userEditModal.addEventListener('keyup', e => {
  const target = e.target
  const inputValue = target.value || ''

  if (target.matches('#user-edit-modal-name')) {
    if (inputValue.length > 50) alert('名字輸入不能超過 50 個字 !')
    userNameCounts.innerText = inputValue.length
  } else {
    if (inputValue.length > 160) alert('自我介紹輸入不能超過 160 個字 !')
    userIntroductionCounts.innerText = inputValue.length
  }
})

saveBtn.addEventListener('click', async e => {
  const target = e.target
  console.log(target)
})
