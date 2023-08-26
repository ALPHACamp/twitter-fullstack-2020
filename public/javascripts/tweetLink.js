const TWEET_CARD_CLASS = '.tweet-card'

const tweets = document.querySelectorAll(TWEET_CARD_CLASS)
tweets.forEach(tweet => {
  tweet.addEventListener('click', event => {
    tweetDirectToLink(event)
  })
})
function tweetDirectToLink (event) {
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
