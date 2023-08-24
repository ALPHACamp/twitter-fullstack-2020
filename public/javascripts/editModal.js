const editModal = document.querySelector('#editModal')
const inputName = document.querySelector('#name')
const inputIntroduction = document.querySelector('#introduction')
const editButton = document.querySelector('#editButton')
const inputBackground = document.querySelector('#background')
const inputAvatar = document.querySelector('#avatar')

// 儲存modal資訊，刷新頁面
editModal.addEventListener('submit', function (event) {
  event.preventDefault()
  const target = event.target
  const UserId = target.dataset.id
  const formData = new FormData()
  formData.append('name', inputName.value)
  formData.append('introduction', inputIntroduction.value)
  formData.append('background', inputBackground.files[0])
  formData.append('avatar', inputAvatar.files[0])
  axios
    .post(`/api/users/${UserId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(res => {
      history.go(0) // 刷新本頁
    })
    .catch(err => console.log(err))
})
