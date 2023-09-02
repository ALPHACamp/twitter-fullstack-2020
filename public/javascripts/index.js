const axios = require('axios')

const editProfile = document.querySelector('#modal-edit-profile')
const modalProfileName = document.querySelector('#modal-profile-name')
const modalProfileIntro = document.querySelector('#modal-profile-intro')
const modalProfileCover = document.querySelector('#modal-profile-cover')
const modalProfileAvatar = document.querySelector('#modal-profile-avatar')
const postModalForm = document.querySelector('#post-modal-form')

// 點擊edit button 取得資料
editProfile.addEventListener('click', event => {
  const target = event.target
  console.log(target)
  const UserId = target.dataset.id
  axios
    .get(`/api/users/${UserId}.json`)
    .then(res => {
      console.log(res)
      modalProfileName.value = res.data.name
      modalProfileIntro.value = res.data.introduction
      modalProfileCover.src = res.data.cover
      modalProfileAvatar.src = res.data.avatar
    })
    .catch(err => console.log(err))
})

// 點擊儲存
postModalForm.addEventListener('submit', function (event) {
  event.preventDefault()
  const target = event.target
  const UserId = target.dataset.id
  const formData = new FormData()
  formData.append('name', modalProfileName.value)
  formData.append('introduction', modalProfileIntro.value)
  formData.append('cover', modalProfileCover.files[0])
  formData.append('avatar', modalProfileAvatar.files[0])

  axios
    .post(`/api/users/${UserId}.json`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(res => {
      history.go(0)
    })
    .catch(err => console.log(err))
})
