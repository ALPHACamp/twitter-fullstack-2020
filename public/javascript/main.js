//根據使用者輸入的內容，會跳出不同按鈕
const tweetTextarea = document.querySelector('.tweetTextarea')
const modalTweetTextarea = document.querySelector('.modal-post-tweet')
const tweetButton = document.querySelector('.tweet-post-button')
const tweetError = document.querySelector('.tweet-post-error')
const modalTweetButton = document.querySelector('.tweet-post-button-modal')
const modalTweetError = document.querySelector('.tweet-post-error-modal')
const re = new RegExp("^[ ]+$")

tweetTextarea.addEventListener('input', function (e) {
  let isSpace = re.test(e.target.value)
  if (isSpace) {
    tweetError.style.display = 'inline'
    tweetButton.style.display = 'none'
  } else if (e.target.value) {
    tweetError.style.display = 'none'
    tweetButton.style.display = 'inline'
  } else {
    tweetError.style.display = 'inline'
    tweetButton.style.display = 'none'
  }
})
modalTweetTextarea.addEventListener('input', function (e) {
  let isSpace = re.test(e.target.value)
  if (isSpace) {
    modalTweetError.style.display = 'inline'
    modalTweetButton.style.display = 'none'
  } else if (e.target.value) {
    modalTweetError.style.display = 'none'
    modalTweetButton.style.display = 'inline'
  } else {
    modalTweetError.style.display = 'inline'
    modalTweetButton.style.display = 'none'
  }
})

// profile modal count input
const nameInput = document.querySelector('.username-input')
const nameInputCount = document.querySelector('.username-input-count')
const briefInput = document.querySelector('.brief-input')
const briefInputCount = document.querySelector('.brief-input-count')

function nameWordCount () {
  return nameInputCount.innerHTML = nameInput.value.length
}
function briefWordCount () {
  return briefInputCount.innerHTML = briefInput.value.length
}