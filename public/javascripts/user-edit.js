const userInfo = document.querySelector('.user-info')
const userAccountCounts = document.querySelector('.user-edit-account-counts')
const userNameCounts = document.querySelector('.user-edit-name-counts')
const userEmailCounts = document.querySelector('.user-edit-email-counts')
const userPasswordCounts = document.querySelector('.user-edit-password-counts')
const userConfirmPasswordCounts = document.querySelector('.user-edit-confirmPassword-counts')

// 在此抓取的 target 只有 input 有 keyup 功能
userInfo.addEventListener('keyup', e => {
  const target = e.target
  const inputValue = target.value || ''

  if (target.matches('#user-edit-account')) {
    if (inputValue.length > 50) alert('帳號輸入不能超過 50 個字 !')
    userAccountCounts.innerText = inputValue.length
  } else if (target.matches('#user-edit-name')) {
    if (inputValue.length > 50) alert('名字輸入不能超過 50 個字 !')
    userNameCounts.innerText = inputValue.length
  } else if (target.matches('#user-edit-email')) {
    if (inputValue.length > 50) alert('Email 輸入不能超過 50 個字 !')
    userEmailCounts.innerText = inputValue.length
  } else if (target.matches('#user-edit-password')) {
    if (inputValue.length > 50) alert('密碼輸入不能超過 50 個字 !')
    userPasswordCounts.innerText = inputValue.length
  } else if (target.matches('#user-edit-confirmPassword')) {
    if (inputValue.length > 50) alert('密碼再確認不能超過 50 個字 !')
    userConfirmPasswordCounts.innerText = inputValue.length
  }
})

// const saveBtn = document.querySelector('.user-edit-save-button')
// const userInfoForm = document.querySelector('.user-info-form')
// 治理最終會回傳 axios 給前端，之後再優化
// const BASE_URL = 'http://localhost:3000'
// userInfoForm.addEventListener('submit', async e => {
//   e.preventDefault()
//   const target = e.target
//   const formData = new FormData(userInfoForm)

//   const res = await axios.post(`${target.action}`, { formData: ...formData },{ headers: {"Content-Type": "multipart/form-data"}})
//   console.log(res)
//   const userData = res.json(res)
//   console.log(userData)

//   const userInfoInputs = document.querySelectorAll('.user-info input')
//   userInfoInputs[0].value = userData.account
//   userInfoInputs[1].value = userData.name
//   userInfoInputs[2].value = userData.email
// })
