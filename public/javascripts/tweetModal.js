const TWEET_MODAL_ID = '#tweet-model'
const MODAL_WARNING_CLASS = '.tweet-reply-warning'
const MAX_TWEET_LENGTH = 140
const tweetModal = document.querySelector(TWEET_MODAL_ID)
const tweetModalTextarea = tweetModal.querySelector('textarea')
const tweetModalForm = tweetModal.querySelector('form')
tweetModalTextarea.addEventListener('input', event => {
  checkTextareaLength(event)
})
tweetModalForm.addEventListener('submit', event => {
  invalidSubmitWarning(event)
})

function invalidSubmitWarning (event) {
  const target = event.target
  if (target.matches(`${TWEET_MODAL_ID} form`)) {
    const warningDiv = tweetModal.querySelector(`${TWEET_MODAL_ID} ${MODAL_WARNING_CLASS}`)
    if (!tweetModalTextarea.value.trim().length) {
      warningDiv.textContent = '內容不可空白'
      event.preventDefault()
      event.stopPropagation()
    } else if (tweetModalTextarea.value.length > MAX_TWEET_LENGTH) {
      warningDiv.textContent = '字數不可超過 140 字'
      event.preventDefault()
      event.stopPropagation()
    } else {
      warningDiv.textContent = ''
      return true
    }
  }
}
function checkTextareaLength (event) {
  const target = event.target
  if (target.matches(`${TWEET_MODAL_ID} textarea`)) {
    const warningDiv = tweetModal.querySelector(`${TWEET_MODAL_ID} ${MODAL_WARNING_CLASS}`)
    if (!target.value.trim().length) {
      warningDiv.textContent = '內容不可空白'
    } else if (target.value.length > MAX_TWEET_LENGTH) {
      warningDiv.textContent = '字數不可超過 140 字'
    } else {
      warningDiv.textContent = ''
    }
  }
}
