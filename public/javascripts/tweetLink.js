const TWEET_CARD_CLASS = '.tweet-card'
/* eslint-disable */
let tweets = document.querySelectorAll(TWEET_CARD_CLASS)
/* eslint-enable */
tweets.forEach(tweet => {
  tweet.addEventListener('click', tweetDirectToLink)
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
