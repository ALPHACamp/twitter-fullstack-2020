const userEditBtn = document.querySelector('.user-edit-modal-button')
const userEditModal = document.querySelector('#user-edit-modal-dialog')
const saveBtn = document.querySelector('.user-edit-save-button')

const userName = document.querySelector('#user-edit-modal-name')
const userNameCounts = document.querySelector('.user-edit-modal-name-counts')
const userIntroduction = document.querySelector('#user-edit-modal-introduction')
const userIntroductionCounts = document.querySelector('.user-edit-modal-introduction-counts')

const uploadAvatarInput = document.querySelector('#avatar-upload-input')
// const uploadAvatarBtn = document.querySelector('.avatar-upload-link')

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

const BASE_URL = 'http://localhost:3000'

// 頭像更新
uploadAvatarInput.addEventListener('change', async e => {
  // e.preventDefault()
  const target = e.target
  const queryUserId = target.dataset.id
  const formData = new FormData()
  console.log('target.files============================' + target.files)
  // 抓取 input 的圖片，存入 formData 以 axios 傳入後端
  formData.append('image', target.files[0])
  const res = await axios.post(`${BASE_URL}/api/users/${queryUserId}/avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  console.log(res)
})

// userEditModal.addEventListener('click', async e => {
//   // e.preventDefault()
//   const target = e.target

//   console.log(target)
// })

// userEditModal.addEventListener('submit', async e => {
//   // e.preventDefault()
//   const target = e.target
//   const userId = target.dataset.id
//   const formData = new FormData(userEditModal)
//   console.log(target)

//   await axios({
//     method: 'post',
//     url: `${BASE_URL}/api/users/${userId}`,
//     data: formData,
//     headers: {
//       'Content-Type': 'multipart/form-data'
//     }
//   })
// })

// const BASE_URL = 'http://localhost:3000'

// saveBtn.addEventListener('click', async e => {
//   const target = e.target
//   const userId = target.dataset.id

//   const queryUser = await axios({
//     method: 'post',
//     url: `${BASE_URL}/api/users/${userId}`
//   })
// })
