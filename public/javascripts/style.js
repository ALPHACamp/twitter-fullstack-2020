'use strict'

const dataPanel = document.querySelector('#data-panel')

dataPanel.addEventListener('click', e => {
  if (e.target.matches('.r-btn')) {
    showReplyModel(e.target.dataset.tid)
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
  const nameMsg = document.querySelector('#name-error-msg')
  nameMsg.textContent = `${target.value.length}`
}
const infoName = document.querySelector('#info-name')
const nameMsg = document.querySelector('#name-error-msg')
const infoIntro = document.querySelector('#info-intro')
const introMsg = document.querySelector('#intro-error-msg')

console.log(infoName)

infoName.addEventListener('keypress', e => {
  nameMsg.textContent = `${infoName.value.length}/50`
  if (infoName.value.length === 50) {
    nameMsg.classList.add('text-error')
  } else if (infoName.value.length < 50) {
    nameMsg.classList.remove('text-error')
  }
})
