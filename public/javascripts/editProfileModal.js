const editModal = document.querySelector('#profileModal')

const inputName = document.querySelector('#modalProfileName')
const inputIntroduction = document.querySelector('#modalProfileInfo')
const editButton = document.querySelector('#editButton')
const inputCover = document.querySelector('#inputCoverImage')
const inputAvatar = document.querySelector('#inputAvatarImage')
const nameLength = document.querySelector('#nameLength')
const introLength = document.querySelector('#introLength')
const avatarValue = document.querySelector('#avatarValue')
const coverValue = document.querySelector('#coverValue')

editButton.addEventListener('click', function (event) {
  const target = event.target
  const UserId = target.dataset.id
  axios
    .get(`/api/users/${UserId}`)
    .then(res => {
      inputName.value = res.data.name
      inputIntroduction.value = res.data.introduction
      avatarValue.src = res.data.avatar
      coverValue.src = res.data.cover ? res.data.cover : `${location.protocol}//${window.location.host}/images/cover-default.jpg`
      nameLength.innerText = `${res.data.name.length}/50`
      introLength.innerText = `${res.data.introduction.length}/160`
    })
    .catch(err => console.log(err))
})
// 儲存modal資訊，刷新頁面
editModal.addEventListener('submit', function (event) {
  event.preventDefault()
  const target = event.target
  const UserId = target.dataset.id
  const formData = new FormData()
  formData.append('name', inputName.value)
  formData.append('introduction', inputIntroduction.value)
  formData.append('cover', inputCover.files[0])
  formData.append('avatar', inputAvatar.files[0])
  axios
    .post(`/api/users/${UserId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(res => {
      console.log(formData.get('name'))
      console.log(formData.get('avatar'))
      history.go(0)   // 刷新本頁

    })
    .catch(err => console.log(err))
})