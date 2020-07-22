//根據使用者輸入的內容，會跳出不同按鈕
const tweetTextarea = document.querySelector('.tweetTextarea')
const tweetButton = document.querySelector('.tweet-post-button')
const tweetError = document.querySelector('.tweet-post-error')
tweetTextarea.addEventListener('input', updateValue);
function updateValue(e) {
  const re = new RegExp("^[ ]+$")
  const isSpace = re.test(e.target.value)
  if (isSpace) {
    tweetError.style.display = 'inline'
    tweetButton.style.display = 'none'
  } else if (e.srcElement.value) {
    tweetError.style.display = 'none'
    tweetButton.style.display = 'inline'
  } else {
    tweetError.style.display = 'inline'
    tweetButton.style.display = 'none'
  }
}