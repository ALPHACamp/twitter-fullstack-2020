const userCover = document.querySelector('#userCover')
const userAvatar = document.querySelector('#userAvatar')
const userName = document.querySelector('#userName')
const userIntro = document.querySelector('#introText')


async function getUserProfile(userId, baseURL) {
  try {
    const dataRaw = await axios.get(`${baseURL}/api/users/${userId}`)
    const userData = dataRaw.data

    userData.cover
      ? (userCover.style.backgroundImage = `url('${userData.cover}')`)
      : (userCover.style.backgroundColor = '#999999')

    userData.avatar
      ? (userAvatar.style.backgroundImage = `url('${userData.avatar}')`)
      : (userAvatar.style.backgroundColor = '#999999')

    userName.value = userData.name

    userIntro.value = userData.introduction


  } catch (err) {
    return res.redirect('back')
  }
}

if (document.querySelector('#edit-profile')) {
  const profileEdit = document.querySelector('#edit-profile')
  profileEdit.addEventListener('click', function onIconClicked(event) {
    if (event.target.matches('#edit-profile-btn')) {
      const baseURL = event.target.dataset.url
      userId = event.target.dataset.id
      getUserProfile(userId, baseURL)
    }
  })
}

removeCover.addEventListener('click', function (event) {
  if (event.target.matches('.fa-times')) {
    chooseCover.value = ''
    userCover.style.backgroundImage = ''
    userCover.style.backgroundColor = '#999999'
  }
})

function nameWordCount() {
  const wordCounts = document.getElementById('userName').value.length
  document.getElementById('nameWordCount').innerHTML = `${wordCounts}/50`
}

function introWordCount() {
  const wordCounts = document.getElementById('introText').value.length
  document.getElementById('introWordCount').innerHTML = `${wordCounts}/160`
}