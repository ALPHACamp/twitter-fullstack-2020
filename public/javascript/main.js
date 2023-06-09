const nameAmount = document.querySelector('.name-amount')
const introductionAmount = document.querySelector('.introduction-amount')
const inputForm = document.querySelector('.input-form')
const saveButton = document.querySelector('.btn-edit')

// 自定變數
const maxName = 50
const maxIntroduction = 160

inputForm.addEventListener('input', event => {
  const { target } = event
  const { length } = target.value
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
})
