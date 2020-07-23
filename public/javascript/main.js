const body = document.querySelector('.container-fluid')
const re = new RegExp("^[ ]+$")

body.addEventListener('input', (e) => {
  const tweetButton = e.target.nextElementSibling.firstElementChild
  const tweetError = e.target.nextElementSibling.lastElementChild
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