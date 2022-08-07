const editModal = document.querySelector('#editProfileModal')

const inputName = document.querySelector('#modalProfileName')
const inputIntroduction = document.querySelector('#modalProfileInfo')
const editButton = document.querySelector('#editButton')
const inputCover = document.querySelector('#inputCoverImage')
const inputAvatar = document.querySelector('#inputAvatarImage')
const nameLength = document.querySelector('#nameLength')
const introLength = document.querySelector('#introLength')
const avatarValue = document.querySelector('#avatarValue')
const coverValue = document.querySelector('#coverValue')
const saveBtn = document.querySelector('#profileModalBtn')

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
      history.go(0)   // 刷新本頁
    })
    .catch(err => console.log(err))
})

saveBtn.addEventListener('click', function () {
  // saveBtn.innerHTML = `<div class="loader"></div>`  /* 圓圈形loader */
  saveBtn.innerHTML = `<span class="loader"></span>`  /* 讀取形loader */
})

editModal.addEventListener('input', e => {
  const lengthOfName = inputName.value.length
  const lengthOfIntro = inputIntroduction.value.length
  nameLength.innerHTML = `${lengthOfName}/50`
  introLength.innerHTML = `${lengthOfIntro}/160`
  if (lengthOfName > 50 || lengthOfName <= 0) {
    inputName.style.color = "red"
    nameLength.style.color = "red"
    nameLength.classList.add('is-invalid')
  } else {
    inputName.style.color = "green"
    nameLength.style.color = "#696974"
    nameLength.classList.remove('is-invalid')
  }
  if (lengthOfIntro > 160) {
    inputIntroduction.style.color = "red"
    introLength.style.color = "red"
    introLength.classList.add('is-invalid')
  } else {
    inputIntroduction.style.color = "green"
    introLength.style.color = "#696974"
    introLength.classList.remove('is-invalid')
  }

  if (lengthOfName > 50 || lengthOfIntro > 160 || lengthOfName <= 0) {
    saveBtn.disabled = true
    saveBtn.classList.add('valid-button')
    saveBtn.innerText = '無法儲存'
  } else {
    saveBtn.disabled = false
    saveBtn.classList.remove('valid-button')
    saveBtn.innerText = '儲存'
  }
})

inputAvatar.onchange = event => {
  const [file] = inputAvatar.files
  if (file) {
    avatarValue.src = URL.createObjectURL(file)
  }
}

inputCover.onchange = event => {
  const [file] = inputCover.files
  if (file) {
    coverValue.src = URL.createObjectURL(file)
    console.log(coverValue.src)
  }
}
