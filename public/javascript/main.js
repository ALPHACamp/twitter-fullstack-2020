//推文有輸入內容，按鈕才可以按
const input = document.querySelector('#description');
const tweetButton = document.querySelector('.tweet-post-button');
input.addEventListener('input', updateValue);
function updateValue(e) {
  const re = new RegExp("^[ ]+$")
  const isSpace = re.test(e.srcElement.value)
  if (isSpace) {
    tweetButton.disabled = true
    tweetButton.style.background = 'rgba(255,102,0,.6)'
  } else if (e.srcElement.value) {
    tweetButton.disabled = false
    tweetButton.style.background = '#ff6600'
  } else {
    tweetButton.disabled = true
    tweetButton.style.background = 'rgba(255,102,0,.6)'
  }
}