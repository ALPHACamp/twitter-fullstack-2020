'use strict'

const dataPanel = document.querySelector('#data-panel')

dataPanel.addEventListener('click', e => {
  if (e.target.matches('.reply')) {
    console.log(e.target.dataset)
    showReplyModel(e.target.dataset.userid, e.target.dataset.tweetid)
  }
})

function showReplyModel (userId, tweetId) {
  const avatar = document.querySelector(`#tweet-avatar-${userId}`).src
  const name = document.querySelector(`#tweet-name-${userId}`).textContent
  const account = document.querySelector(`#tweet-account-${userId}`).textContent
  const time = document.querySelector(`#tweet-time-${tweetId}`).textContent
  const description = document.querySelector(`#description-${tweetId}`)
    .textContent

  const replyAvatar = document.querySelector('#reply-tweet-avatar')
  const replyName = document.querySelector('#reply-tweet-name')
  const replyDescription = document.querySelector('#reply-tweet-description')
  const replyInput = document.querySelector('#reply-input')
  replyAvatar.src = avatar
  replyName.innerHTML = `${name} <small class="text-muted fw-light" id="reply-tweet-account" style="font-size: 14px;">${account}${time}</small>`
  replyDescription.textContent = description
  replyInput.action = `/tweets/${tweetId}/replies`
}
