const userEditBtn = document.querySelector('.user-edit-modal-button')
const userEditModal = document.querySelector('#user-edit-modal-dialog')
const modalSaveBtn = document.querySelector('.user-edit-modal-save-button')
const modalCloseBtn = document.querySelector('.user-edit-modal-close-button')

const userName = document.querySelector('#user-edit-modal-name')
const userNameCounts = document.querySelector('.user-edit-modal-name-counts')
const userIntroduction = document.querySelector('#user-edit-modal-introduction')
const userIntroductionCounts = document.querySelector('.user-edit-modal-introduction-counts')

const userCover = document.querySelector('#cover-upload-img')
const userCoverInput = document.querySelector('#cover-upload-input')
const userAvatar = document.querySelector('#avatar-upload-img')
const userAvatarInput = document.querySelector('#avatar-upload-input')

const BASE_URL = 'http://localhost:3000'
// 點擊 "編輯個人按鈕" 計算顯示的字數
userEditBtn.addEventListener('click', async e => {
  try {
    const target = e.target
    // console.log(target)

    const queryUserId = target.dataset.id
    const res = await axios.get(`${BASE_URL}/api/users/${queryUserId}`)

    // res.body = res.data.user
    const userInfo = res.data.user

    console.log(res)

    userName.value = userInfo.name
    userNameCounts.innerText = userInfo.name.length

    userIntroduction.innerText = userInfo.introduction
    userIntroductionCounts.innerText = userInfo.introduction.length

    userCover.src = userInfo.cover
    userAvatar.src = userInfo.avatar
  } catch (err) {
    console.log(err)
  }
})

// 字數即時更新功能，在此抓取的 target 只有 input 或 textarea 有 keyup 功能
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

// 顯示本地圖片的圖片
userEditModal.addEventListener('change', e => {
  const target = e.target
  // console.log(target.value)
  const reader = target.matches('input') ? new FileReader() : ''

  if (target.matches('#avatar-upload-input')) {
    reader.addEventListener('load', () => {
      userAvatar.src = reader.result
    })
    reader.readAsDataURL(target.files[0])
  } else if (target.matches('#cover-upload-input')) {
    reader.addEventListener('load', () => {
      userCover.src = reader.result
    })
    reader.readAsDataURL(target.files[0])
  }
})

// 關閉 modal 要清空 input 裏 image 占據的空間
modalCloseBtn.addEventListener('click', e => {
  userCoverInput.value = null
  userAvatarInput.value = null
})

// 儲存 modal 資訊
userEditModal.addEventListener('submit', e => {
  const target = e.target
  console.log(target)
})

// const BASE_URL = 'http://localhost:3000'
// const uploadAvatarInput = document.querySelector('#avatar-upload-input')
// const uploadAvatarBtn = document.querySelector('.avatar-upload-link')
// 頭像更新
// uploadAvatarInput.addEventListener('change', async e => {
//   // e.preventDefault()
//   const target = e.target
//   const queryUserId = target.dataset.id
//   const formData = new FormData()
//   console.log('target.files============================' + target.files)
//   // 抓取 input 的圖片，存入 formData 以 axios 傳入後端
//   formData.append('image', target.files[0])
//   const res = await axios.post(`${BASE_URL}/api/users/${queryUserId}/avatar`, formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data'
//     }
//   })
//   console.log(res)
// })

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
