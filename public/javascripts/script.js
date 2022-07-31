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
    target.dataset.bsDismiss = 'modal'
    target.click()

    // 建構表單
    const infoForm = document.querySelector('#info-form')
    const infoFormData = new FormData(infoForm)
    const infoCoverPhoto = document.querySelector('#profile-cover-photo')
    const infoAvatar = document.querySelector('#profile-avatar')
    const infoName = document.querySelector('#profile-name')
    const infoIntro = document.querySelector('#profile-intro')
    // 送出表單
    // eslint-disable-next-line no-undef
    const res = await axios({
      method: 'post',
      url: `/api/users/${target.dataset.userid}`,
      data: infoFormData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    const userInfo = res.data.data

    // 修改網頁顯示資料
    infoCoverPhoto.src = userInfo.coverPhoto
    infoAvatar.src = userInfo.avatar
    infoName.textContent = userInfo.name
    infoIntro.textContent = userInfo.introduction

    target.dataset.bsDismiss = ''
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
    const data = await axios.get(`/api/users/${uid}`)
    const existUser = data.data.existUser
    const infoCoverPhoto = document.querySelector('#info-cover-photo')
    const infoAvatar = document.querySelector('#info-avatar')
    const infoName = document.querySelector('#info-name')
    const nameLength = document.querySelector('#name-length')
    const infoIntro = document.querySelector('#info-intro')
    const introLength = document.querySelector('#intro-length')
    const submitBtn = document.querySelector('#post-info')
    if (existUser.coverPhoto) {
      infoCoverPhoto.style.backgroundImage = `url('${existUser.coverPhoto}')`
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
      infoCoverPhoto.style.backgroundImage = "url('/public/pic/NoPicture')"
    } else if (target.matches('#input-avatar')) {
      infoAvatar.src = '/public/pic/NoPicture'
    }
  }
}
