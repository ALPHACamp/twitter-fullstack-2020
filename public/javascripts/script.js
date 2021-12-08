// const axios = require("axios")
async function getTweet(id) {
  const tweet = await axios.get(`http://localhost:3000/api/tweet/${id}`)
  return tweet.data
}

// 取得 Toast 事件時間
function appendZero(element) {
  if (element < 10) {
    return '0' + element
  } else {
    return '' + element
  }
}

function getDate() {
  const date = new Date()
  const hour = date.getHours() // 0 ~ 23
  const minutes = date.getMinutes() // 0 ~ 59
  const second = date.getSeconds() // 0 ~ 59
  return appendZero(hour) + '-' + appendZero(minutes) + '-' + appendZero(second)
}
// Toast 元件選項, # 預設值: {animation: true, autohide: true, delay: 5000 } (5秒)
const option = {
  animation: true,
  autohide: true,
  delay: 500
}
// DOM 元件
const tweetModal = document.getElementById('tweetModal')
const toastAlert = document.getElementById('liveToast')
const toastTime = toastAlert.querySelector('small')
const toastText = toastAlert.querySelector('.toast-body')
const submitForm = document.getElementById('newTweetForm')
// 初始化元件, 使其具有功能選項
const toast = new bootstrap.Toast(toastAlert)
let tweetModalObj = ''
let modalText = ''
// const toast = new bootstrap.Toast(toastAlert, option); // 添加 Toast 選項用法

// Tweet Modal Process
if (tweetModal != null) {
  tweetModalObj = new bootstrap.Modal(tweetModal)
  modalText = document.getElementById('newTweet')
  tweetModal.addEventListener('shown.bs.modal', event => {
    modalText.value = ''
    toastTime.textContent = getDate()
    toastText.textContent = '開始推文'
    toast.show()
  })
  tweetModal.addEventListener('hide.bs.modal', event => {
    modalText.value = ''
  })
}

// Modal submit 事件處理, 先停止 submit 動作, 判定合法推文, 再呼叫 submit 處理
function tweetSubmitButtonClick(event) {
  event.preventDefault();
  //other stuff you want to do instead...
  if (modalText.value === '') {
    toastTime.textContent = getDate()
    toastText.textContent = '推文失敗: 沒有推文內容!'
    toast.show()
  } else if (modalText.value.length > 140) {
    toastTime.textContent = getDate()
    toastText.textContent = '推文失敗: 超過字數限制!'
    toast.show()
  } else {
    toastTime.textContent = getDate()
    toastText.textContent = '推文成功!'
    toast.show()
    submitForm.submit()
    modalText.value = ''
    tweetModalObj.hide()
  }
}

// Reply Modal Process
const replyModal = document.getElementById('replyModal')
if (replyModal != null) {
  replyModalObj = new bootstrap.Modal(replyModal)
  modalText = document.getElementById('newReply')
  replyModal.addEventListener('shown.bs.modal', event => {
    modalText.value = ''
    toastTime.textContent = getDate()
    toastText.textContent = '開始推文'
    toast.show()
  })
  replyModal.addEventListener('hide.bs.modal', event => {
    modalText.value = ''
  })
}

function replySubmitButtonClick(event) {
  event.preventDefault();
  //other stuff you want to do instead...
  if (modalText.value === '') {
    toastTime.textContent = getDate()
    toastText.textContent = '回復失敗: 沒有推文內容!'
    toast.show()
  } else if (modalText.value.length > 140) {
    toastTime.textContent = getDate()
    toastText.textContent = '回復失敗: 超過字數限制!'
    toast.show()
  } else {
    toastTime.textContent = getDate()
    toastText.textContent = '回復成功!'
    toast.show()
    submitForm.submit()
    modalText.value = ''
    tweetModalObj.hide()
  }
}

// profileModal Process
const profileModal = document.getElementById('profileModal')
let profileName = ''
let profileIntro = ''

if (profileModal != null) {
  profileModalObj = new bootstrap.Modal(profileModal)
  profileName = document.getElementById('profileName')
  profileIntro = document.getElementById('profileIntro')
  const coverFile = document.getElementById('coverFile')
  const avatarFile = document.getElementById('avatarFile')
  const coverInput = document.getElementById('uploadCover')
  const avatarInput = document.getElementById('uploadAvatar')
  const nameLength = document.getElementById('nameLength')
  const introLength = document.getElementById('introLength')
  // Modal show init
  profileModal.addEventListener('shown.bs.modal', event => {
    nameLength.textContent = `${profileName.value.length}/50`
    introLength.textContent = `${profileIntro.value.length}/140`
    coverFile.style.color = "#FFFFFF"
    avatarFile.style.color = "#FFFFFF"
    toastTime.textContent = getDate()
    toastText.textContent = '開始編輯個人資料'
    toast.show()
  })
  // Modal hide reset
  profileModal.addEventListener('hide.bs.modal', event => {
    console.log('coverInput.value', coverInput.value)
    if (coverInput.value !== '') {
      coverInput.value = ''
      coverFile.style.color = "#FFFFFF"
    }
    console.log('avatarInput.value', avatarInput.value)
    if (avatarInput.value !== '') {
      avatarInput.value = ''
      avatarFile.style.color = "#FFFFFF"
    }
  })
  // update typing length
  profileName.addEventListener('input', event => {
    const nameStrLen = profileName.value.length
    nameLength.textContent = `${nameStrLen}/50`
    if (nameStrLen >= 50) {
      nameLength.style.color = "red";
    } else {
      nameLength.style.color = "black";
    }
  })
  profileIntro.addEventListener('input', event => {
    const introStrLen = profileIntro.value.length
    introLength.textContent = `${introStrLen}/140`
    if (introStrLen >= 140) {
      introLength.style.color = "red";
    } else {
      introLength.style.color = "black";
    }
  })
  coverInput.addEventListener('change', event => {
    if (coverInput.value === '') {
      coverFile.style.color = "#FFFFFF"
    } else {
      coverFile.style.color = "#40E0D0"
    }
  })
  avatarInput.addEventListener('change', event => {
    if (avatarInput.value === '') {
      avatarFile.style.color = "#FFFFFF"
    } else {
      avatarFile.style.color = "#40E0D0"
    }
  })
}

function profileSubmitButtonClick(event) {
  event.preventDefault();
  //other stuff you want to do instead...
  if (profileName.value === '') {
    toastTime.textContent = getDate()
    toastText.textContent = '更新失敗: 沒有姓名!'
    toast.show()
  } else if (profileName.value.lenth > 50) {
    toastTime.textContent = getDate()
    toastText.textContent = '更新失敗: 姓名超過字數限制!'
    toast.show()
  } else if (profileIntro.value.length > 140) {
    toastTime.textContent = getDate()
    toastText.textContent = '更新失敗: 超過字數限制!'
    toast.show()
  } else {
    toastTime.textContent = getDate()
    toastText.textContent = '更新成功!'
    toast.show()
    submitForm.submit()
    profileModalObj.hide()
  }
}