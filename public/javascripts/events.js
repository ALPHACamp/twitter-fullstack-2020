//推文
const addTweet = document.querySelector('#description-modal')
const addButton = document.querySelector('#modal-post-button')
//留言
const comment = document.querySelector('#comment-modal')
const replyButton = document.querySelector('#replybtn')

//推文
addTweet.addEventListener('input', function check(event) {
  if (addTweet.value.length < 1) {
    addTweet.classList.add('is-invalid')
    addTweet.nextElementSibling.innerHTML = "內容不可為空白"
  }
  if (addTweet.value.length > 140) {
    addTweet.classList.add('is-invalid')
    addTweet.nextElementSibling.innerHTML = "字數超過140字"
  }
  if (addTweet.value.length > 0 && addTweet.value.length < 140) {
    addTweet.classList.remove('is-invalid')
  }
})

addButton.addEventListener('click', function check(event) {
  if (addTweet.value.length < 1) {
    addTweet.classList.add('is-invalid')
    addTweet.nextElementSibling.innerHTML = "內容不可為空白"
    event.preventDefault()
  }
  if (addTweet.value.length > 140) {
    addTweet.classList.add('is-invalid')
    addTweet.nextElementSibling.innerHTML = "字數超過140字"
    event.preventDefault()
  }
})

//留言
comment.addEventListener('input', function check(event) {
  if (comment.value.length < 1) {
    comment.classList.add('is-invalid')
    comment.nextElementSibling.innerHTML = "內容不可為空白"
  }
  if (comment.value.length > 1) {
    comment.classList.remove('is-invalid')
  }
})

replyButton.addEventListener('click', function check(event) {
  if (comment.value.length < 1) {
    comment.classList.add('is-invalid')
    comment.nextElementSibling.innerHTML = "內容不可為空白"
    event.preventDefault()
  }

const coverInput = document.querySelector('#cover-input')
const coverWrapper = document.querySelector('#cover-wrapper')
const currentCover = document.querySelector('#current-cover')
const deleteCoverBtn = document.querySelector('#delete-cover-btn')
const avatarInput = document.querySelector('#avatar-input')
const currentAvatar = document.querySelector('#current-avatar')
const avatarWrapper = document.querySelector('#avatar-wrapper')


coverInput.addEventListener('change', function showCoverPreview(event) {
  
  if (event.target.files.length !== 0) { 
    const src = URL.createObjectURL(event.target.files[0])
    let previewArea = document.createElement('div')
    previewArea.innerHTML = `
      <img src="${src}" class="cover" id="file-cover-preview">
    `
    // 若是初次選擇檔案，要先隱藏使用者封面，並加上刪除按鈕
    if (!currentCover.classList.contains('hide')) {
      currentCover.classList.add('hide')
      deleteCoverBtn.classList.remove('hide')
    }
    //　若是重複選擇檔案，先把前一個選擇的圖片移除
    if (coverWrapper.children.length > 1) {
      coverWrapper.lastElementChild.remove()
    }
    coverWrapper.appendChild(previewArea)
  }
})


deleteCoverBtn.addEventListener('click', function deleteCoverPreview() {
  coverInput.value =""
  coverWrapper.lastElementChild.remove()
  currentCover.classList.remove('hide')
  deleteCoverBtn.classList.add('hide')
})

avatarInput.addEventListener('change', function showAvatarPreview(event) {
  
  if (event.target.files.length !== 0) {
    const src = URL.createObjectURL(event.target.files[0])
    let previewArea = document.createElement('div')
    previewArea.innerHTML = `
      <img src="${src}" class="avatar large" id="file-avatar-preview">
    `
    // 若是初次選擇檔案，要先隱藏使用者頭貼
    if (!currentAvatar.classList.contains('hide')) {
      currentAvatar.classList.add('hide')
    }
    //　若是重複選擇檔案，要先把前一個選擇的圖片移除
    if (avatarWrapper.children.length > 1) {
      avatarWrapper.lastElementChild.remove()
    }
    avatarWrapper.appendChild(previewArea)
  }
})