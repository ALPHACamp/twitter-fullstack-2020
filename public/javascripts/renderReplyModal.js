const TWEET_CARDS = '.tweet-card'

/* eslint-disable */
let tweetCards = document.querySelectorAll(TWEET_CARDS)
/* eslint-enable */

const TWEET_REPLY_CARD = '.tweet-reply'
const tweetReplyCard = document.querySelector(TWEET_REPLY_CARD)

const REPLY_MODAL_ID = '#reply-model'
const REPLY_MODAL_WARNING_CLASS = '.tweet-reply-warning'
const MAX_REPLY_LENGTH = 140
const replyModal = document.querySelector(REPLY_MODAL_ID)

const replyModalTextarea = replyModal.querySelector('textarea')
const replyModalForm = replyModal.querySelector('form')

if (!isRepliesPage) {
  tweetCards.forEach(tweet => {
    tweet.addEventListener('click', event => {
      renderReplyModal(event)
    })
  })
} else if (!isUserReplyPage) {
  tweetReplyCard.addEventListener('click', event => {
    renderRepliesPageReplyModal(event)
  })
}

function renderReplyModal (event) {
  if (event.target.closest(`button[data-bs-target="${REPLY_MODAL_ID}"]`) &&
    event.currentTarget.matches(TWEET_CARDS)
  ) {
    const tweetCard = event.currentTarget
    const tweetId = tweetCard.dataset.id
    const userIcon = tweetCard.querySelector('.tweet-user-icon img').src
    const userLink = tweetCard.querySelector('.tweet-user-icon a').href
    const userInfo = tweetCard.querySelectorAll('.tweet-user-horizontal p')
    const userName = userInfo[0].textContent
    const userAccount = userInfo[1].textContent
    const userAccountAt = userAccount.split('・')[0]
    const tweetContent = tweetCard.querySelector('.tweet-card-content>p').textContent.trim()

    replyModal.querySelector('.model-reply-icon img').src = userIcon
    const modelUserInfo = replyModal.querySelectorAll('.tweet-user-horizontal p')
    modelUserInfo[0].textContent = userName
    modelUserInfo[1].textContent = userAccount
    replyModal.querySelector('.tweet-card-content>p').textContent = tweetContent
    replyModal.querySelector('.tweet-user-replied p:last-of-type').textContent = userAccountAt
    replyModal.querySelector('form').action = `/tweets/${tweetId}/replies`
    replyModal.querySelectorAll('a').forEach(a => {
      a.href = userLink
    })
  }
}

function renderRepliesPageReplyModal (event) {
  if (event.target.closest(`button[data-bs-target="${REPLY_MODAL_ID}"]`) &&
    event.currentTarget.matches(TWEET_REPLY_CARD)
  ) {
    const tweetReplyCard = event.currentTarget
    const tweetId = tweetReplyCard.dataset.id
    const userIcon = tweetReplyCard.querySelector('.tweet-user-icon img').src
    const userLink = tweetReplyCard.querySelector('.tweet-user-icon a').href
    const userInfo = tweetReplyCard.querySelectorAll('.tweet-user-vertical p')
    const userName = userInfo[0].textContent
    const userAccount = userInfo[1].textContent
    const userAccountAt = userAccount.split('・')[0]
    const tweetContent = tweetReplyCard.querySelector('.tweet-reply-content>p').textContent.trim()

    replyModal.querySelector('.model-reply-icon img').src = userIcon
    const modelUserInfo = replyModal.querySelectorAll('.tweet-user-horizontal p')
    modelUserInfo[0].textContent = userName
    modelUserInfo[1].textContent = userAccount
    replyModal.querySelector('.tweet-card-content>p').textContent = tweetContent
    replyModal.querySelector('.tweet-user-replied p:last-of-type').textContent = userAccountAt
    replyModal.querySelector('form').action = `/tweets/${tweetId}/replies`
    replyModal.querySelectorAll('a').forEach(a => {
      a.href = userLink
    })
  }
}

replyModalTextarea.addEventListener('input', event => {
  checkReplyTextareaLength(event)
})
replyModalForm.addEventListener('submit', event => {
  invalidReplySubmitWarning(event)
})

function invalidReplySubmitWarning (event) {
  const target = event.target
  if (target.matches(`${REPLY_MODAL_ID} form`)) {
    const warningDiv = replyModal.querySelector(`${REPLY_MODAL_ID} ${REPLY_MODAL_WARNING_CLASS}`)
    if (!replyModalTextarea.value.trim().length) {
      warningDiv.textContent = '內容不可空白'
      event.preventDefault()
      event.stopPropagation()
    } else if (replyModalTextarea.value.length > MAX_REPLY_LENGTH) {
      warningDiv.textContent = '字數不可超過 140 字'
      event.preventDefault()
      event.stopPropagation()
    } else {
      warningDiv.textContent = ''
      return true
    }
  }
}
function checkReplyTextareaLength (event) {
  const target = event.target
  if (target.matches(`${REPLY_MODAL_ID} textarea`)) {
    const warningDiv = replyModal.querySelector(`${REPLY_MODAL_ID} ${REPLY_MODAL_WARNING_CLASS}`)
    if (!target.value.trim().length) {
      warningDiv.textContent = '內容不可空白'
    } else if (target.value.length > MAX_REPLY_LENGTH) {
      warningDiv.textContent = '字數不可超過 140 字'
    } else {
      warningDiv.textContent = ''
    }
  }
}
