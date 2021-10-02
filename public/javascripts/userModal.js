const userCoverInput = document.querySelector('#user-cover-block')
const userAvatarInput = document.querySelector('#user-avatar-edit')
const userNameInput = document.querySelector('#user-name-input')
const userInfoInput = document.querySelector('#user-intro-input')
const messageNameCount = document.querySelector('#count_message_name')
const messageIntroCount = document.querySelector('#count_message_info')
const chooseCover = document.querySelector('#upload_cover')
const removeCover = document.querySelector('#edit-btn-group')
const chooseAvatar = document.querySelector('#upload_avatar')

// const baseURL = 'http://localhost:3000'
async function getUserProfile (userId, baseURL) {
  try {
    const dataRaw = await axios.get(`${baseURL}/api/users/${userId}`)
    const userData = dataRaw.data

    userData.cover
      ? (userCoverInput.style.backgroundImage = `url('${userData.cover}')`)
      : (userCoverInput.style.backgroundColor = '#999999')

    userData.avatar
      ? (userAvatarInput.style.backgroundImage = `url('${userData.avatar}')`)
      : (userAvatarInput.style.backgroundColor = '#999999')

    userNameInput.value = userData.name
    userInfoInput.value = userData.introduction
    messageNameCount.innerHTML = `${userData.name.length}/50`
    messageIntroCount.innerHTML = `${userData.introduction.length}/160`
  } catch (err) {
    return res.redirect('back')
  }
}

function getImgData (fileName, previewArea) {
  const files = fileName.files[0]
  if (files) {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(files)
    fileReader.addEventListener('load', function () {
      previewArea.style.backgroundImage = `url('${this.result}')`
    })
  }
}

userNameInput.addEventListener('keyup', function countCharacters (event) {
  messageNameCount.innerHTML = `${userNameInput.value.length}/50`
})

userInfoInput.addEventListener('keyup', function countCharacters (event) {
  messageIntroCount.innerHTML = `${userInfoInput.value.length}/160`
})

if (document.querySelector('#edit-profile')) {
  const profileEdit = document.querySelector('#edit-profile')
  profileEdit.addEventListener('click', function onIconClicked (event) {
    if (event.target.matches('#edit-profile-btn')) {
      const baseURL = event.target.dataset.url
      userId = event.target.dataset.id
      getUserProfile(userId, baseURL)
    }
  })
}

chooseCover.addEventListener('change', function () {
  getImgData(chooseCover, userCoverInput)
})

removeCover.addEventListener('click', function (event) {
  if (event.target.matches('.fa-times')) {
    chooseCover.value = ''
    userCoverInput.style.backgroundImage = ''
    userCoverInput.style.backgroundColor = '#999999'
  }
})

chooseAvatar.addEventListener('change', function () {
  getImgData(chooseAvatar, userAvatarInput)
})
