const profileModalForm = document.querySelector('#profile-modal-form')
const inputName = document.querySelector('#name')
const inputIntroduction = document.querySelector('#introduction')
const inputCover = document.querySelector('#modal-cover')
const inputAvatar = document.querySelector('#modal-avatar')
const avatarBtn = document.querySelector('#avatar-btn')
const coverBtn = document.querySelector('#cover-btn')
const editButton = document.querySelector('#edit-button')

editButton.addEventListener('click', function (event) {
  const target = event.target
  const UserId = target.dataset.id
  axios
    .get(`http://localhost:3000/api/users/${UserId}.json`)
    .then(res => {
      console.log(res)
      inputName.value = res.data.name
      inputIntroduction.value = res.data.introduction
      inputCover.src = res.data.cover
      inputAvatar.src = res.data.avatar
    })
    .catch(err => console.log(err))
})

// 儲存modal資訊，刷新頁面
profileModalForm.addEventListener('submit', function (event) {
  event.preventDefault()
  const target = event.target
  const UserId = target.dataset.id
  const formData = new FormData()
  formData.append('name', inputName.value)
  formData.append('introduction', inputIntroduction.value)
  formData.append('cover', coverBtn.files[0])
  formData.append('avatar', avatarBtn.files[0])

  axios
    .post(`http://localhost:3000/api/users/${UserId}.json`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(res => {
      history.go(0)
    })
    .catch(err => console.log(err))
})
