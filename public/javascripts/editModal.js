import axios from 'axios'

const editModal = document.querySelector('#editProfileModal')
const inputName = document.querySelector('#name')
const inputIntroduction = document.querySelector('#introduction')
const inputCover = document.querySelector('#cover')
const inputAvatar = document.querySelector('#avatar')
const editButton = document.querySelector('#editButton')

editButton.addEventListener('click', function (event) {
  const target = event.target
  const UserId = target.data.id
  axios
    .get(`http://localhost:3000/api/users/${UserId}.json`)
    .then(res => {
      inputName.value = target.data.name
      inputIntroduction.value = target.data.introduction
      inputCover.src = target.data.cover
      inputAvatar.src = target.data.avatar
    })
    .catch(err => console.log(err))
})

// 儲存modal資訊，刷新頁面
editModal.addEventListener('submit', function (event) {
  event.preventDefault()
  const target = event.target
  const UserId = target.data.id
  const formData = new FormData()
  formData.append('name', inputName.value)
  formData.append('introduction', inputIntroduction.value)
  formData.append('cover', inputCover.files[0])
  formData.append('avatar', inputAvatar.files[0])
  axios
    .post(`http://localhost:3000/api/users/${UserId}.json`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(res => {
      history.go(0)
    })
    .catch(err => console.log(err))
})
