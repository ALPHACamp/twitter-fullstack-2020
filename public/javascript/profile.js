const nameAmount = document.querySelector('.name-amount')
const introductionAmount = document.querySelector('.introduction-amount')
const inputForm = document.querySelector('.input-form')
const saveButton = document.querySelector('.btn-edit')
const coverImg = document.querySelector('.cover-img')
const avatarImg = document.querySelector('.avatar-img')

// 自定變數
const maxName = 50
const maxIntroduction = 160

inputForm.addEventListener('input', event => {
  const { target } = event
  const { length } = target.value
  // 顯示字數
  if (target.name === 'name') {
    if (length > maxName) {
      nameAmount.innerText = `${length}/${maxName}`
      saveButton.disabled = true
      return swal('暱稱', '字數超過上限', 'warning')
    }
    saveButton.disabled = false
    return (nameAmount.innerText = `${length}/${maxName}`)
  }
  if (target.name === 'introduction') {
    if (length > maxIntroduction) {
      nameAmount.innerText = `${length}/${maxName}`
      saveButton.disabled = true
      return swal('自我介紹', '字數超過上限', 'warning')
    }
    saveButton.disabled = false
    return (introductionAmount.innerText = `${length}/${maxIntroduction}`)
  }
  // 顯示照片
  if (target.name === 'cover') {
    previewFile(target, coverImg)
  }
  if (target.name === 'avatar') {
    previewFile(target, avatarImg)
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
