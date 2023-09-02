const axios = require('axios')

const editProfile = document.querySelector('#modal-edit-profile')
const modalProfileName = document.querySelector('#modal-profile-name')
const modalProfileIntro = document.querySelector('#modal-profile-intro')
const modalProfileCover = document.querySelector('#modal-profile-cover')
const modalProfileAvatar = document.querySelector('#modal-profile-avatar')

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
