const profileEdit = document.querySelector('#edit-profile')
const userCoverInput = document.querySelector('#user-cover-block')
const userAvatarInput = document.querySelector('#user-avatar-edit')
const userNameInput = document.querySelector('#user-name-input')
const userInfoInput = document.querySelector('#user-intro-input')
const messageNameCount = document.querySelector('#count_message_name')
const messageIntroCount = document.querySelector('#count_message_info')
const baseURL = 'http://localhost:3000'
async function getUserProfile (id) {
  try {
    const dataRaw = await axios.get(`http://localhost:3000/api/users/${userId}`)
    const userData = dataRaw.data.user

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
    console.log(err)
  }
}

userNameInput.addEventListener('keyup', function countCharacters (event) {
  messageNameCount.innerHTML = `${userNameInput.value.length}/50`
})

userInfoInput.addEventListener('keyup', function countCharacters (event) {
  messageIntroCount.innerHTML = `${userInfoInput.value.length}/160`
})

profileEdit.addEventListener('click', function onIconClicked (event) {
  if (event.target.matches('#edit-profile-btn')) {
    userId = event.target.dataset.id
    getUserProfile(userId)
  }
})
