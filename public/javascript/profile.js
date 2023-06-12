const nameAmount = document.querySelector('.name-amount')
const introductionAmount = document.querySelector('.introduction-amount')
const inputForm = document.querySelector('.input-form')
const coverImg = document.querySelector('.cover-img')
const avatarImg = document.querySelector('.avatar-img')
const inputName = document.querySelector('.input-name')
const inputIntroduction = document.querySelector('.input-introduction')

// 自定變數
const maxName = 50
const maxIntroduction = 160

inputForm.addEventListener('input', event => {
  const { target } = event
  const { length } = target.value
  // 顯示字數
  if (target.name === 'name') {
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
})

inputForm.addEventListener('submit', event => {
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
