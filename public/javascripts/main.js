const avatarInputGroup = document.querySelector('#avatar-input-group')
const coverInputGroup = document.querySelector('#cover-input-group')

avatarInputGroup.children[0].addEventListener('change', () => {
  const file = avatarInputGroup.children[0].files[0]
  avatarInputGroup.children[1].style.backgroundImage = `url(\"${URL.createObjectURL(file)}\")`
})

coverInputGroup.children[0].addEventListener('change',() => {
  const file = coverInputGroup.children[0].files[0]
  document.querySelector('#edit-image').style.backgroundImage = `url(\"${URL.createObjectURL(file)}\")`
})
