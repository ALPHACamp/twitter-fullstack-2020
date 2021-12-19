const listTweet = document.querySelector('.list-tweet')
const profileBtn = document.querySelector('#profile-buttons')

profileBtn.addEventListener('click', event => {
  const target = event.target

  // USER TWEETS
  if (target.matches('#tweets')) {
    profileBtn.children[0].classList.add('item-active')
    profileBtn.children[1].classList.remove('item-active')
    profileBtn.children[2].classList.remove('item-active')

    listTweet.children[0].classList.remove('d-none')
    listTweet.children[1].classList.add('d-none')
    listTweet.children[2].classList.add('d-none')

    return
  }

  // USER REPLIES
  if (target.matches('#replies')) {
    profileBtn.children[0].classList.remove('item-active')
    profileBtn.children[1].classList.add('item-active')
    profileBtn.children[2].classList.remove('item-active')

    listTweet.children[0].classList.add('d-none')
    listTweet.children[1].classList.remove('d-none')
    listTweet.children[2].classList.add('d-none')

    return
  }

  // USER LIKES
  if (target.matches('#likes')) {
    profileBtn.children[0].classList.remove('item-active')
    profileBtn.children[1].classList.remove('item-active')
    profileBtn.children[2].classList.add('item-active')

    listTweet.children[0].classList.add('d-none')
    listTweet.children[1].classList.add('d-none')
    listTweet.children[2].classList.remove('d-none')

    return
  }
})

const profileModal = document.getElementById('profileModal')
const profileForm = document.getElementById('profileForm')

if (profileModal !== null) {
  const profileName = document.getElementById('profileName')
  const nameLength = document.getElementById('nameLength')
  
  const profileIntro = document.getElementById('profileIntro')
  const introLength = document.getElementById('introLength')

  const coverFile = document.getElementById('coverFile')
  const avatarFile = document.getElementById('avatarFile')
  const coverInput = document.getElementById('uploadCover')
  const avatarInput = document.getElementById('uploadAvatar')

  // Modal show init
  profileModal.addEventListener('shown.bs.modal', e => {
    coverFile.style.color = "#FFFFFF"
    avatarFile.style.color = "#FFFFFF"
  })
  // Modal hide reset
  profileModal.addEventListener('hide.bs.modal', e => {
    if (coverInput.value !== '') {
      coverInput.value = ''
      coverFile.style.color = "#FFFFFF"
    }
    if (avatarInput.value !== '') {
      avatarInput.value = ''
      avatarFile.style.color = "#FFFFFF"
    }
  })
  // update typing length
  profileName.addEventListener('input', e => {
    const nameStrLen = profileName.value.length
    nameLength.textContent = `${nameStrLen}/50`
    if (nameStrLen >= 50) {
      nameLength.style.color = "red"
      profileName.classList.add('is-invalid')
    } else {
      nameLength.style.color = "#657786"
      profileName.classList.remove('is-invalid')
    }
  })
  profileIntro.addEventListener('input', e => {
    const introStrLen = profileIntro.value.length
    introLength.textContent = `${introStrLen}/160`
    if (introStrLen >= 160) {
      introLength.style.color = "red"
      introLength.classList.add('is-invalid')
    } else {
      introLength.style.color = "#657786"
      introLength.classList.remove('is-invalid')
    }
  })
  coverInput.addEventListener('change', e => {
    if (coverInput.value === '') {
      coverFile.style.color = "#FFFFFF"
    } else {
      coverFile.style.color = "#40E0D0"
    }
  })
  avatarInput.addEventListener('change', e => {
    if (avatarInput.value === '') {
      avatarFile.style.color = "#FFFFFF"
    } else {
      avatarFile.style.color = "#40E0D0"
    }
  })
}
