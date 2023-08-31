const axios = require('axios')

const editProfile = document.querySelector('.edit-profile')
const modalProfileName = document.querySelector('#modal-profile-name')
const modalProfileIntro = document.querySelector('#modal-profile-intro')

// 點擊edit button 取得資料
editProfile.addEventListener('submit', e => {
  e.preventDefault()
  const { target } = e
  console.log(target)
  const UserId = target.dataset.id
  const formData = new FormData()
  formData.append('name', modalProfileName.value)
  formData.append('introduction', modalProfileIntro.value)
  // formData.append('background', inputBackground.files[0])
  // formData.append('avatar', inputAvatar.files[0])
  axios
    .post(`/api/users/${UserId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(res => {
      history.go(0) // 刷新本頁
    })
    .catch(err => console.log(err))
})
