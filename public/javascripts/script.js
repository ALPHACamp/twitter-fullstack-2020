'use strict'
window.URL = window.URL || window.webkitURL

const dataPanel = document.querySelector('#data-panel')

dataPanel.addEventListener('click', e => {
  if (e.target.matches('.r-btn')) {
    showReplyModel(e.target.dataset.tid)
  } else if (e.target.matches('#show-info-modal')) {
    showInfoModal(e.target.dataset.userid)
  } else if (e.target.matches('#post-info')) {
    postInfoForm(e.target)
  }
})

dataPanel.addEventListener('input', e => {
  if (e.target.matches('#info-name')) {
    infoNameCheck(e.target)
  } else if (e.target.matches('#info-intro')) {
    infoIntroCheck(e.target)
  }
})

dataPanel.addEventListener('change', e => {
  if (e.target.matches('.input-pic')) {
    showInputFile(e.target)
  }
})

const replyInputs = document.querySelector('#reply-input')

if (replyInputs) {
  replyInputs.addEventListener('submit', e => {
    replyFormVerify(e)
  })
}
// 接收後端傳來的錯誤訊息
function showErrorMessage (message) {
  const div = document.querySelector('#messages-area')
  div.innerHTML = `<div class="alert alert-light alert-dismissible fade show fixed-top mx-auto mt-5 shadow-sm" role="alert" style="z-index:1200;">
  <div class="row align-items-center ps-5" data-bs-dismiss="alert" aria-label="Close"><p class="fs-6 col-10 mb-0 p-0">${message}</p><a class="col-1" >
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="28" r="27" stroke="#FC5A5A" stroke-width="2"></circle>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M34.8512 22.4513C34.9367 22.3659 35.0046 22.2645 35.0509 22.1528C35.0972 22.0412 35.1211 21.9215 35.1212 21.8007C35.1213 21.6798 35.0975 21.5601 35.0514 21.4484C35.0052 21.3367 34.9374 21.2352 34.852 21.1497C34.7666 21.0642 34.6652 20.9963 34.5536 20.95C34.4419 20.9037 34.3223 20.8798 34.2014 20.8797C34.0805 20.8796 33.9608 20.9034 33.8491 20.9496C33.7374 20.9957 33.6359 21.0635 33.5504 21.1489L28 26.6993L22.4512 21.1489C22.2785 20.9762 22.0443 20.8792 21.8 20.8792C21.5558 20.8792 21.3215 20.9762 21.1488 21.1489C20.9761 21.3216 20.8791 21.5558 20.8791 21.8001C20.8791 22.0443 20.9761 22.2786 21.1488 22.4513L26.6992 28.0001L21.1488 33.5489C21.0633 33.6344 20.9955 33.7359 20.9492 33.8477C20.9029 33.9594 20.8791 34.0791 20.8791 34.2001C20.8791 34.321 20.9029 34.4408 20.9492 34.5525C20.9955 34.6642 21.0633 34.7658 21.1488 34.8513C21.3215 35.024 21.5558 35.121 21.8 35.121C21.921 35.121 22.0407 35.0972 22.1525 35.0509C22.2642 35.0046 22.3657 34.9368 22.4512 34.8513L28 29.3009L33.5504 34.8513C33.7231 35.0238 33.9573 35.1206 34.2014 35.1205C34.4455 35.1203 34.6795 35.0232 34.852 34.8505C35.0245 34.6778 35.1213 34.4436 35.1212 34.1995C35.121 33.9554 35.0239 33.7214 34.8512 33.5489L29.3008 28.0001L34.8512 22.4513Z"
  fill="#FC5A5A"></path></svg></a></div></div>`
}

function showReplyModel (tid) {
  const avatar = document.querySelector(`#avatar-${tid}`).src
  const name = document.querySelector(`#name-${tid}`).textContent
  const account = document.querySelector(`#account-${tid}`).textContent
  const time = document.querySelector(`#time-${tid}`).textContent
  const description = document.querySelector(`#description-${tid}`).textContent

  const replyAvatar = document.querySelector('#reply-tweet-avatar')
  const replyName = document.querySelector('#reply-tweet-name')
  const replyDescription = document.querySelector('#reply-tweet-description')
  const replyInput = document.querySelector('#reply-input')
  const replyTo = document.querySelector('#reply-to')
  replyAvatar.src = avatar
  replyName.innerHTML = `${name} <small class="text-muted fw-light" id="reply-tweet-account" style="font-size: 14px;">${account}．${time}</small>`
  replyDescription.textContent = description
  replyInput.action = `/tweets/${tid}/replies`
  replyTo.textContent = account
}

function replyFormVerify (e) {
  const replyTextArea = document.querySelector('#reply-comment')
  const errorMsg = document.querySelector('#error-msg')
  if (replyTextArea.value.length === 0 || replyTextArea.value.length > 140) {
    e.preventDefault()
    e.stopPropagation()
    errorMsg.textContent = '內容不可空白'
  }
}

async function postInfoForm (target) {
  try {
    const formName = document.querySelector('#info-name')
    const formIntro = document.querySelector('#info-intro')
    if (
      formName.value.length === 0 ||
      formName.value.length > 50 ||
      formIntro.value.length > 160
    ) {
      return
    }

    // 建構表單
    const infoForm = document.querySelector('#info-form')
    const infoFormData = new FormData(infoForm)
    const infoCoverPhoto = document.querySelector('#profile-cover-photo')
    const infoAvatar = document.querySelector('#profile-avatar')
    const infoName = document.querySelector('#profile-name')
    const infoIntro = document.querySelector('#profile-intro')
    const avatars = document.querySelectorAll('.tweet-avatar')
    // 送出表單
    // eslint-disable-next-line no-undef
    const res = await axios({
      method: 'post',
      url: `/api/users/${target.dataset.userid}`,
      data: infoFormData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    if (res.data.status === 'error') {
      return showErrorMessage(res.data.message)
    }
    // 修改網頁顯示資料
    const userInfo = res.data.data
    infoCoverPhoto.src = userInfo.coverPhoto
    infoAvatar.src = userInfo.avatar
    infoName.textContent = userInfo.name
    infoIntro.textContent = userInfo.introduction
    for (let i = 0; i < avatars.length; i++) {
      if (avatars[i].dataset.avatarUid === target.dataset.userid) {
        avatars[i].src = userInfo.avatar
      }
    }
    // 關閉表單
    document.querySelector('#info-close').click()
  } catch (err) {
    console.log(err)
  }
}

function infoNameCheck (target) {
  const nameLength = document.querySelector('#name-length')
  const nameMsg = document.querySelector('#name-error-msg')
  const length = target.value.length

  if (length === 0) {
    nameMsg.classList.add('text-error')
    nameMsg.textContent = '名稱不可為空白'
  } else if (length <= 50) {
    nameMsg.classList.remove('text-error')
    nameMsg.textContent = ''
  } else if (length > 50) {
    nameMsg.classList.add('text-error')
    nameMsg.textContent = '最多只能50個字'
  }
  nameLength.textContent = `${length}/50`
}

function infoIntroCheck (target) {
  const introLength = document.querySelector('#intro-length')
  const introMsg = document.querySelector('#intro-error-msg')
  const length = target.value.length
  if (length <= 160) {
    introMsg.classList.remove('text-error')
    introMsg.textContent = ''
  } else if (length > 160) {
    introMsg.classList.add('text-error')
    introMsg.textContent = '最多只能160個字'
  }
  introLength.textContent = `${length}/160`
}
async function showInfoModal (uid) {
  try {
    // eslint-disable-next-line no-undef
    const res = await axios.get(`/api/users/${uid}`)
    if (res.data.status === 'error') {
      return showErrorMessage(res.data.message)
    }
    const existUser = res.data.existUser
    const infoCoverPhoto = document.querySelector('#info-cover-photo')
    const infoAvatar = document.querySelector('#info-avatar')
    const infoName = document.querySelector('#info-name')
    const nameLength = document.querySelector('#name-length')
    const infoIntro = document.querySelector('#info-intro')
    const introLength = document.querySelector('#intro-length')
    const submitBtn = document.querySelector('#post-info')
    if (existUser.coverPhoto) {
      infoCoverPhoto.style.backgroundImage = `url(${existUser.coverPhoto})`
    }
    infoAvatar.src = existUser.avatar
    infoName.value = existUser.name
    nameLength.textContent = `${existUser.name.length}/50`
    infoIntro.value = existUser.introduction
    introLength.textContent = `${existUser.introduction.length}/160`
    submitBtn.dataset.userid = existUser.id
  } catch (err) {
    console.log(err)
  }
}

function showInputFile (target) {
  const fileName = target.value
  const ext = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase()
  const infoCoverPhoto = document.querySelector('#info-cover-photo')
  const infoAvatar = document.querySelector('#info-avatar')
  if (
    target.files &&
    target.files[0] &&
    (ext === 'gif' || ext === 'jpg' || ext === 'png' || ext === 'jpeg')
  ) {
    const [file] = target.files
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = function (e) {
      if (target.matches('#input-cover-photo')) {
        infoCoverPhoto.style.backgroundImage = `url('${e.target.result}')`
      } else if (target.matches('#input-avatar')) {
        infoAvatar.src = e.target.result
      }
    }
  } else {
    if (target.matches('#input-cover-photo')) {
      infoCoverPhoto.style.backgroundImage = "url('/pic/where_the_pic.png')"
    } else if (target.matches('#input-avatar')) {
      infoAvatar.src = '/pic/where_the_pic.png'
    }
  }
}
