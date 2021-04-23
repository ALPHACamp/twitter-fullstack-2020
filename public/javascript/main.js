// 顯示更多
const displayMore = document.querySelector('.display-more')
const userList = document.querySelector('.user-list')

if (displayMore) {
  displayMore.addEventListener('click', event => {
    event.preventDefault()
    const orgHeight = parseInt(userList.style.height, 10)
    userList.style.height = (orgHeight > 100) ? '284px' : userList.scrollHeight + 'px'
    userList.style.transition = 'height .4s ease-out'
    userList.style.overflow = 'scroll'
    displayMore.style.visibility = 'hidden'
  })
}

// 預覽圖片
const preview = (input) => {
  const coverPreview = document.querySelector('#cover-modal')
  const avatarPreview = document.querySelector('#avatar-modal')
  const reader = new window.FileReader()
  reader.onload = (event) => {
    if (input.id === 'cover') {
      coverPreview.src = `${event.target.result}`
    }
    if (input.id === 'avatar') {
      avatarPreview.src = `${event.target.result}`
    }
  }
  reader.readAsDataURL(input.files[0])
}

module.exports = preview
