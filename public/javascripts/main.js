const avatarInputGroup = document.querySelector('#avatar-input-group')
const coverInputGroup = document.querySelector('#cover-input-group')
const nameInputGroup = document.querySelector('#name-input-group')
const editProfileModalButton = document.querySelector('#edit-profile-modal-button')

editProfileModalButton.addEventListener('click',async () => {
  let user =await axios.get('http://localhost:8000/api/user')
  user = user.data
  avatarInputGroup.children[1].style.backgroundImage = `url(\"${user.avatar}\")`
  document.querySelector('#edit-image').style.backgroundImage = `url(\"${user.cover}\")`
  nameInputGroup.firstElementChild.value = user.name
})

avatarInputGroup.children[0].addEventListener('change', () => {
  const file = avatarInputGroup.children[0].files[0]
  avatarInputGroup.children[1].style.backgroundImage = `url(\"${URL.createObjectURL(file)}\")`
})

coverInputGroup.children[0].addEventListener('change',() => {
  const file = coverInputGroup.children[0].files[0]
  document.querySelector('#edit-image').style.backgroundImage = `url(\"${URL.createObjectURL(file)}\")`
})

coverInputGroup.lastElementChild.addEventListener('click', () => {
  document.querySelector('#edit-image').style.backgroundImage = ""
  document.querySelector('#edit-image').style.backgroundColor = "#657786"
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
