const avatarInputGroup = document.querySelector('#avatar-input-group')
const coverInputGroup = document.querySelector('#cover-input-group')
const nameInputGroup = document.querySelector('#name-input-group')
const introductionInputGroup = document.querySelector('#introduction-input-group')
const editProfileModalButton = document.querySelector('#edit-profile-modal-button')

if (editProfileModalButton){
  editProfileModalButton.addEventListener('click', async () => {
    let user = await axios.get(`/api/users/${editProfileModalButton.dataset.userId}`)
    user = user.data
    avatarInputGroup.children[1].style.backgroundImage = `url(\"${user.avatar}\")`
    document.querySelector('#edit-image').style.backgroundImage = `url(\"${user.cover}\")`
    nameInputGroup.firstElementChild.value = user.name
    introductionInputGroup.firstElementChild.value = user.introduction
    nameInputGroup.lastElementChild.innerHTML = ""
    introductionInputGroup.lastElementChild.innerHTML = ""
    document.querySelector('#cancelBackground').value = ""
  })
}


avatarInputGroup.children[0].addEventListener('change', () => {
  const file = avatarInputGroup.children[0].files[0]
  avatarInputGroup.children[1].style.backgroundImage = `url(\"${URL.createObjectURL(file)}\")`
})

coverInputGroup.children[0].addEventListener('change',() => {
  const file = coverInputGroup.children[0].files[0]
  document.querySelector('#edit-image').style.backgroundImage = `url(\"${URL.createObjectURL(file)}\")`
  document.querySelector('#cancelBackground').value = ""
})


coverInputGroup.lastElementChild.addEventListener('click', () => {
  document.querySelector('#edit-image').style.backgroundImage = 'url("https://i.imgur.com/gJ4dfOZ.jpeg")'
  document.querySelector('#cancelBackground').value = "1"
  coverInputGroup.children[0].value = ""
})

nameInputGroup.firstElementChild.addEventListener('input', (event) => {
  if (event.target.value.length === 50){
    nameInputGroup.lastElementChild.style.color = "red"
  }else{
    nameInputGroup.lastElementChild.style.color = "#657786"
  }
  nameInputGroup.lastElementChild.innerHTML = `${event.target.value.length}/50`
})

introductionInputGroup.firstElementChild.addEventListener('input', (event) => {
  if (event.target.value.length === 160) {
    introductionInputGroup.lastElementChild.style.color = "red"
  } else {
    introductionInputGroup.lastElementChild.style.color = "#657786"
  }
  introductionInputGroup.lastElementChild.innerHTML = `${event.target.value.length}/160`
})