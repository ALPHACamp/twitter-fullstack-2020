const userEditBtn = document.querySelector('.user-edit-modal-button')

const userNameAll = document.querySelectorAll('.self-name')
const userIntroduction = document.querySelector('.introduction')
const userCover = document.querySelector('.cover')
const userAvatarAll = document.querySelectorAll('.self-avatar')

const userEditModal = document.querySelector('#user-edit-modal-dialog')
const modalCloseBtn = document.querySelector('.user-edit-modal-close-button')
const modalremoveCoverBtn = document.querySelector('.user-edit-modal-remove-cover')
const acCover = 'https://i.imgur.com/OrTW5at.png'

const userModalName = document.querySelector('#user-edit-modal-name')
const userModalNameCounts = document.querySelector('.user-edit-modal-name-counts')
const userModalIntroduction = document.querySelector('#user-edit-modal-introduction')
const userModalIntroductionCounts = document.querySelector('.user-edit-modal-introduction-counts')

const userModalCover = document.querySelector('#cover-upload-img')
const userModalCoverInput = document.querySelector('#cover-upload-input')
const userModalAvatar = document.querySelector('#avatar-upload-img')
const userModalAvatarInput = document.querySelector('#avatar-upload-input')

const BASE_URL = 'http://localhost:3000'
// 點擊 "編輯個人按鈕" 計算顯示的字數
userEditBtn.addEventListener('click', async e => {
  try {
    const target = e.target
    const queryUserId = target.dataset.id

    const res = await axios.get(`${BASE_URL}/api/users/${queryUserId}`)
    const userInfo = res.data.user

    userModalName.value = userInfo.name
    userModalNameCounts.innerText = userInfo.name.length

    userModalIntroduction.innerText = userInfo.introduction
    userModalIntroductionCounts.innerText = userInfo.introduction.length

    userModalCover.src = userInfo.cover
    userModalAvatar.src = userInfo.avatar
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
    userModalNameCounts.innerText = inputValue.length
  } else {
    if (inputValue.length > 160) alert('自我介紹輸入不能超過 160 個字 !')
    userModalIntroductionCounts.innerText = inputValue.length
  }
})

// 顯示本地圖片的圖片
userEditModal.addEventListener('change', e => {
  const target = e.target
  const reader = target.matches('input') ? new FileReader() : ''

  if (target.matches('#avatar-upload-input')) {
    reader.addEventListener('load', () => {
      userModalAvatar.src = reader.result
    })
    reader.readAsDataURL(target.files[0])
  } else if (target.matches('#cover-upload-input')) {
    reader.addEventListener('load', () => {
      userModalCover.src = reader.result
    })
    reader.readAsDataURL(target.files[0])
  }
})

// 關閉 modal 要清空 input 裏 image 占據的空間
modalCloseBtn.addEventListener('click', e => {
  userModalCover.src = userCover.src // 如果使用者有按 remove cover 會需要恢復成原本的 src
  userModalCoverInput.value = null
  userModalAvatarInput.value = null
})

// 點擊 remove cover 的 X
modalremoveCoverBtn.addEventListener('click', e => {
  // 排除使用者可能按了 input 圖片又再按 remove cover 需要把 input 裏面的圖片檔案清除
  userModalCover.src = acCover
  userModalCoverInput.value = null
})

// 儲存 modal 資訊
userEditModal.addEventListener('submit', async e => {
  e.preventDefault()
  const target = e.target
  const queryUserId = target.dataset.id

  const formData = new FormData()
  formData.append('cover', userModalCoverInput.files[0])
  formData.append('avatar', userModalAvatarInput.files[0])
  formData.append('name', userModalName.value)
  formData.append('introduction', userModalIntroduction.value)
  userModalCover.src === acCover ? formData.append('acCover', 'https://i.imgur.com/OrTW5at.png') : formData.append('acCover', '')
  const res = await axios.post(`${BASE_URL}/api/users/${queryUserId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  userModalCoverInput.value = null
  userModalAvatarInput.value = null

  const userInfo = res.data.user
  userIntroduction.innerText = userInfo.introduction
  userCover.src = userInfo.cover
  userNameAll.forEach(username => { username.innerText = userInfo.name })
  if (userInfo.avatar)userAvatarAll.forEach(useravatar => { useravatar.src = userInfo.avatar })
})
