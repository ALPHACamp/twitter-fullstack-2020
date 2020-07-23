const body = document.querySelector('.container-fluid')
const re = new RegExp("^[ ]+$")

body.addEventListener('input', (e) => {
  const tweetButton = e.target.nextElementSibling.firstElementChild
  const tweetError = e.target.nextElementSibling.lastElementChild
  let isSpace = re.test(e.target.value)
  if (isSpace) {
    tweetError.style.display = 'inline'
    tweetButton.style.display = 'none'
  } else if (e.target.value) {
    tweetError.style.display = 'none'
    tweetButton.style.display = 'inline'
  } else {
    tweetError.style.display = 'inline'
    tweetButton.style.display = 'none'
  }
})
modalTweetTextarea.addEventListener('input', function (e) {
  let isSpace = re.test(e.target.value)
  if (isSpace) {
    modalTweetError.style.display = 'inline'
    modalTweetButton.style.display = 'none'
  } else if (e.target.value) {
    modalTweetError.style.display = 'none'
    modalTweetButton.style.display = 'inline'
  } else {
    modalTweetError.style.display = 'inline'
    modalTweetButton.style.display = 'none'
  }
})

// profile modal count input
const nameInput = document.querySelector('.username-input')
const nameInputCount = document.querySelector('.username-input-count')
const briefInput = document.querySelector('.brief-input')
const briefInputCount = document.querySelector('.brief-input-count')

nameInput.addEventListener('keyup', () => {
  return nameInputCount.innerHTML = nameInput.value.length
})
briefInput.addEventListener('keyup', () => {
  return briefInputCount.innerHTML = briefInput.value.length
})

// remove cover
const removeCoverButton = document.querySelector('.cover-remove')
const cover = document.querySelector('.edit-modal-cover')
const inputCover = document.querySelector('#cover-upload')

removeCoverButton.addEventListener('click', () => {
  cover.style.background = `url("")`
  inputCover.value = null
})

// preview upload file
function previewFile (input) {
  const coverPreview = document.querySelector('#editModalCover')
  const avatarPreview = document.querySelector('#editModalAvatar')
  const reader = new FileReader()
  reader.onload = (event) => {
    if (input.id === 'cover') {
      coverPreview.style = `background:url("${event.target.result}"); background-position: center; background-size: cover;`
    }
    if (input.id === 'avatar') {
      avatarPreview.style = `background:url("${event.target.result}"); background-position: center; background-size: cover;`
    }
  }
  reader.readAsDataURL(input.files[0])
}
