const tweetSubmitButton = document.querySelector('#tweet-submit-button')
const tweetForm = document.querySelector('#tweet-form')
const tweetFeedback = document.querySelector('.tweet-feedback')
const tweetClose = document.querySelector('#tweet-close')
const textArea = document.querySelector('#description')

const MAX_TWEET_COUNT = 140

tweetSubmitButton.addEventListener('click', event => {
  tweetForm.classList.add('was-validated')
})

tweetForm.addEventListener('submit', event => {
  if (!tweetForm.checkValidity()) {
    event.stopPropagation()
    event.preventDefault()
  }
})

tweetForm.addEventListener('input', event => {
  const { target } = event
  const content = target.value
  // tweet
  checkTweetValid(target, content, MAX_TWEET_COUNT)
})

tweetClose.addEventListener('click', event => {
  // 關掉modal時清空錯誤訊息和textarea
  tweetFeedback.innerText = ''
  textArea.value = ''
})

function checkTweetValid (target, content, maxLength) {
  // 如果內容只有空白或換行
  if (content.trim().length === 0) {
    target.setCustomValidity('內容不可空白')
    tweetFeedback.innerText = target.validationMessage
  } else if (content.length > maxLength) {
    target.setCustomValidity(`字數不可超過${maxLength}字`)
    tweetFeedback.innerText = target.validationMessage
  } else {
    target.setCustomValidity('')
  }
}
