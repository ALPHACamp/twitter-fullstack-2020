const editProfileBtn = document.querySelector('.btn-edit-profile')

const editBody = document.querySelector('.edit-profile-modal-body')
const form = document.querySelector('#form')
const submitButton = document.querySelector('#submit')

const coverImage = document.querySelector('#cover-image')
const coverFile = document.querySelector('#cover')
const deleteCoverButton = document.querySelector('.edit-x-icon')
const avatarImage = document.querySelector('#avatar-image')
const avatarFile = document.querySelector('#avatar')
const nameInput = document.querySelector('#edit-name')
const introInput = document.querySelector('#intro')
const spinner = document.querySelector('.spinner-border')
const spinnerBackground = document.querySelector('.spinning-background')
const inputMinmax = document.querySelector('.input-minmax')
const textareaMinmax = document.querySelector('.textarea-minmax')

let coverPath = ''
let avatarPath = ''

// AJAX for user profile
editProfileBtn.addEventListener('click', async () => {
  try {
    form.classList.remove('was-validated')
    inputMinmax.innerText = ''
    textareaMinmax.innerText = ''
    nameInput.setCustomValidity("")
    introInput.setCustomValidity("")

    const UserId = editProfileBtn.dataset.userid
    const data = await axios.get(`/api/users/${UserId}`)
    const user = data.data

    // 重置設定
    coverImage.src = user.cover || '/stylesheets/icons/mountain.png'
    coverFile.value = ''
    coverPath = ''
    avatarImage.src = user.avatar || '/stylesheets/icons/avatar.png'
    avatarFile.value = ''
    avatarPath = ''
    nameInput.value = user.name
    introInput.value = user.introduction
  } catch (err) { console.log(err) }
})


// AJAX for cover image
coverFile.addEventListener('change', async () => {
  try {
    if (coverFile.files[0].size > 10485760) return alert('請上傳10MB以下的檔案')
    spinnerBackground.classList.add('spinning-background-show')
    spinner.classList.add('spinner-border-show')

    const formData = new FormData()
    formData.append('cover', coverFile.files[0])
    const data = await axios.post(`/api/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    coverPath = data.data.coverPath
    coverImage.src = coverPath

    spinnerBackground.classList.remove('spinning-background-show')
    spinner.classList.remove('spinner-border-show')
  } catch (err) { console.log(err) }
})

deleteCoverButton.addEventListener('click', async () => {
  try {
    const UserId = editProfileBtn.dataset.userid
    const data = await axios.get(`/api/users/${UserId}`)

    coverPath = data.data.cover || '/stylesheets/icons/mountain.png'
    coverImage.src = coverPath
    coverFile.value = ''
  } catch (err) { console.log(err) }
})


// AJAX for avatar image
avatarFile.addEventListener('change', async () => {
  try {
    if (avatarFile.files[0].size > 10485760) return alert('請上傳10MB以下的檔案')

    spinnerBackground.classList.add('spinning-background-show')
    spinner.classList.add('spinner-border-show')

    const formData = new FormData()
    formData.append('avatar', avatarFile.files[0])
    const data = await axios.post(`/api/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    avatarPath = data.data.avatarPath
    avatarImage.src = avatarPath

    spinnerBackground.classList.remove('spinning-background-show')
    spinner.classList.remove('spinner-border-show')
  } catch (err) { console.log(err) }
})


//form validation from front-end
submitButton.addEventListener('click', async function onSubmitClick() {
  try {
    event.preventDefault()
    event.stopPropagation()
    form.classList.add('was-validated')

    if (!form.checkValidity()) return

    const sentForm = {
      cover: coverPath,
      avatar: avatarPath,
      name: nameInput.value,
      introduction: introInput.value
    }

    const UserId = editProfileBtn.dataset.userid
    const data = await axios.post(`/api/users/${UserId}`, sentForm)

    if (data.status === 200) window.location.replace(`/users/${UserId}/tweets`)

    coverPath = ''
    avatarPath = ''

  } catch (err) { console.log(err) }
})


// Name
nameInput.addEventListener('keyup', function countLetters() {
  const target = event.target
  const counter = target.parentElement.lastElementChild
  counter.innerText = `${target.value.length}/50`
})

nameInput.addEventListener('keyup', function onInputKeyUp() {
  if (event.target.value.length > 50) {
    event.target.setCustomValidity("Invalid field.")
  } else {
    event.target.setCustomValidity("")
  }
})

// Introduction
introInput.addEventListener('keyup', function countLetters() {
  const target = event.target
  const counter = target.parentElement.lastElementChild
  counter.innerText = `${target.value.length}/160`
})

introInput.addEventListener('keyup', function onInputKeyUp() {
  if (event.target.value.length > 160) {
    event.target.setCustomValidity("Invalid field.")
  } else {
    event.target.setCustomValidity("")
  }
})