'use strict'

const dataPanel = document.querySelector('#data-panel')

dataPanel.addEventListener('click', e => {
  if (e.target.matches('#r-btn')) {
    showReplyModel(e.target.dataset.tid)
  } else if (e.target.matches('#show-info-modal')) {
    showInfoModal(e.target.dataset.userid)
  }
})

dataPanel.addEventListener('input', e => {
  if (e.target.matches('#info-name')) {
    infoNameCheck(e.target)
  } else if (e.target.matches('#info-intro')) {
    infoIntroCheck(e.target)
  }
})

const replyInputs = document.querySelector('#reply-input')
const infoForm = document.querySelector('#info-form')

if (replyInputs) {
  replyInputs.addEventListener('submit', e => {
    replyFormVerify(e)
  })
}
if (infoForm) {
  infoForm.addEventListener('submit', e => {
    infoFormVerify(e)
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

function infoFormVerify (e) {
  const infoName = document.querySelector('#info-name')
  const infoIntro = document.querySelector('#info-intro')
  if (
    infoName.value.length === 0 ||
    infoName.value.length > 50 ||
    infoIntro.value.length > 160
  ) {
    e.preventDefault()
    e.stopPropagation()
  }
}

function infoNameCheck (target) {
  const nameLength = document.querySelector('#name-length')
  const nameMsg = document.querySelector('#name-error-msg')
  const length = target.value.length
  if (length <= 50) {
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
  // eslint-disable-next-line no-undef
  tools.callLoading()
  const data = await axios.get(`/api/users/${uid}`)
  tools.closeLoading()
  const existUser = data.data.existUser
  const infoCoverPhoto = document.querySelector('#info-cover-photo')
  const infoAvatar = document.querySelector('#info-avatar')
  const infoName = document.querySelector('#info-name')
  const infoIntro = document.querySelector('#info-intro')
  infoCoverPhoto.style.backgroundImage = `url('${existUser.coverPhoto}')`
  infoAvatar.src = existUser.avatar
  infoName.value = existUser.name
  infoIntro.value = existUser.introduction
  infoForm.action = `/api/users/${uid}`
}
