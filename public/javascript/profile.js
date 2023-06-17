const nameAmount = document.querySelector('.name-amount')
const introductionAmount = document.querySelector('.introduction-amount')
const inputForm = document.querySelector('.input-form')
const coverImg = document.querySelector('.cover-img')
const avatarImg = document.querySelector('.avatar-img')
const inputName = document.querySelector('.input-name')
const inputIntroduction = document.querySelector('.input-introduction')
const closeButton = document.querySelector('.close-btn')
const avatarInput = document.querySelector('input[name="avatar"]')
const coverInput = document.querySelector('input[name="cover"]')
const editUserData = document.querySelector('#edit-user-data')

// 自定變數
const maxName = 50
const maxIntroduction = 160

// 取得完整的URL
const url = window.location.href

// 使用正則表達式從URL中匹配數字
const matches = url.match(/\/(\d+)/)

// 取得匹配結果中的數字
const userId = matches[1]

editUserData.addEventListener('click', event => {
  axios
    .get(`/api/users/${userId}`)
    // json資料
    .then(res => {
      if (res.data.status === 'success') {
        coverImg.src = res.data.cover
        avatarImg.src = res.data.avatar
        inputName.value = res.data.name
        nameAmount.innerText = `${res.data.name.length}/${maxName}`
        inputIntroduction.value = res.data.introduction
        introductionAmount.innerText = `${res.data.introduction.length}/${maxIntroduction}`
      } else {
        throw new Error(res.data.messages)
      }
    })
    .catch(err => {
      console.log(err)
    })
})

// 如果直接關閉，回覆成原始資料
closeButton.addEventListener('click', () => {
  coverInput.value = ''
  avatarInput.value = ''
  inputName.setCustomValidity('')
  inputIntroduction.setCustomValidity('')
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
