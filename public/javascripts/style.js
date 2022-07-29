'use strict'

const dataPanel = document.querySelector('#data-panel')

dataPanel.addEventListener('click', e => {
  if (e.target.matches('.r-btn')) {
    showReplyModel(e.target.dataset.tid)
  }
})

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
