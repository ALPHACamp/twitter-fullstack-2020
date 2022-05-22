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

userEditBtn.addEventListener('click', async e => {
  try {
    const target = e.target
    const queryUserId = target.dataset.id

    const res = await axios.get(`${BASE_URL}api/users/${queryUserId}`)
    const userInfo = res.data

    userModalName.value = userInfo.name || ''
    userModalNameCounts.innerText = userInfo.name.length || 0

    userModalIntroduction.innerText = userInfo.introduction || ''
    userModalIntroductionCounts.innerText = userInfo.introduction?.length || 0

    userModalCover.src = userInfo.cover || ''
    userModalAvatar.src = userInfo.avatar || ''
  } catch (err) {
    console.log(err)
  }
})

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

modalCloseBtn.addEventListener('click', e => {
  userModalCover.src = userCover.src
  userModalCoverInput.value = null
  userModalAvatarInput.value = null
})

modalremoveCoverBtn.addEventListener('click', e => {
  userModalCover.src = acCover
  userModalCoverInput.value = null
})

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
  const res = await axios.post(`${BASE_URL}api/users/${queryUserId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  userModalCoverInput.value = null
  userModalAvatarInput.value = null

  window.location.reload()
})
