const TWEET_CARD_CLASS = '.tweet-card'
const REPLY_MODAL_ID = '#reply-model'

const replyModal = document.querySelector(REPLY_MODAL_ID)

const tweets = document.querySelectorAll(TWEET_CARD_CLASS)
tweets.forEach(tweet => {
  tweet.addEventListener('click', event => {
    tweetDirectToLink(event)
    renderReplyModal(event)
  })
})
function tweetDirectToLink (event) {
  /* 移轉tweet-card上面的連結 */
  if (event.target.closest('.tweet-user-action')) { // closet可以在點擊子元素時，精準抓到父元素
    event.stopPropagation() // 防止觸發label
    return
  }

  if (event.target.closest(TWEET_CARD_CLASS)) {
    const target = event.currentTarget
    const directTo = target.dataset.link
    const redirectLink = `${window.location.origin}${directTo}`
    // origin http://localhost:3000/
    // link: tweets/5/replies
    location.href = redirectLink
  }
}

function renderReplyModal (event) {
  if (event.target.closest(`button[data-bs-target="${REPLY_MODAL_ID}"]`) &&
    event.currentTarget.matches(TWEET_CARD_CLASS)
  ) {
    const tweetCard = event.currentTarget
    const userId = tweetCard.dataset.id
    const userIcon = tweetCard.querySelector('.tweet-user-icon img').src
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
    replyModal.querySelector('form').action = `/tweets/${userId}/replies`
  }
}
