const nameAmount = document.querySelector('.name-amount')
const introductionAmount = document.querySelector('.introduction-amount')
const inputForm = document.querySelector('.input-form')
const coverImg = document.querySelector('.cover-img')
const avatarImg = document.querySelector('.avatar-img')
const inputName = document.querySelector('.input-name')
const inputIntroduction = document.querySelector('.input-introduction')
const editButton = document.querySelector('.edit-btn')

// 自定變數
const maxName = 50
const maxIntroduction = 160
// 紀錄modal有無送出
let buttonPressed = false
// 紀錄原始圖片
const originCoverImg = coverImg.src
const originAvatarImg = avatarImg.src

editButton.addEventListener('click', () => {
  if (!buttonPressed) {
    coverImg.src = originCoverImg
    avatarImg.src = originAvatarImg
  }
})

inputForm.addEventListener('input', event => {
  const { target } = event
  const { length } = target.value

  if (target.name === 'name') {
    // 顯示字數
    nameAmount.innerText = `${length}/${maxName}`
    checkLength(inputName, length, maxName)
  }

  if (target.name === 'introduction') {
    introductionAmount.innerText = `${length}/${maxIntroduction}`
    checkLength(inputIntroduction, length, maxIntroduction)
  }

  // 顯示照片
  if (target.name === 'cover') {
    previewFile(target, coverImg)
  }

  if (target.name === 'avatar') {
    previewFile(target, avatarImg)
  }

  if (target.name === 'coverDelete') {
    coverImg.src = '/images/profile/cover.png'
  }
})

inputForm.addEventListener('submit', event => {
  submitButton()
  if (!inputForm.checkValidity()) {
    event.stopPropagation()
    event.preventDefault()
  }
})

// 照片預覽
function previewFile(target, targetImage) {
  const reader = new FileReader()
  const file = target.files[0]
  reader.onload = event => {
    targetImage.src = event.target.result
  }
  reader.readAsDataURL(file)
}

// 文字超過上限
function checkLength(target, length, maxLength) {
  if (length > maxLength) {
    target.setCustomValidity('字數超過上限')
  } else {
    target.setCustomValidity('')
  }
}

// 用於modal的按鈕有無被觸發
function submitButton() {
  return (buttonPressed = true)
}
