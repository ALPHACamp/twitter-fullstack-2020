//確認推文送出的字數限制與相關訊息

const tweetText = document.querySelector('#tweetText')
const tweetTextBtn = document.querySelector('#tweetTextBtn')
const mainTweetText = document.querySelector('#mainTweetText')
const mainTweetTextBtn = document.querySelector('#mainTweetTextBtn')
const mainReplyBtn = document.querySelector('#mainReplyBtn')
const mainReplyText = document.querySelector('#mainReplyText')

console.log(tweetText)
console.log(mainReplyText)
console.log(mainReplyBtn)

if (tweetText)
  listenText(tweetText, tweetTextBtn)

if (mainTweetText)
  listenText(mainTweetText, mainTweetTextBtn)

if (mainReplyBtn)
  listenText(mainReplyText, mainReplyBtn)


function listenText(eText, eBtn) {
  eBtn.setAttribute('disabled', '')
  eText.addEventListener('input', (e) => {
    const textLength = eText.value.trim().length
    if (textLength === 0 || textLength > 140) {
      return eBtn.setAttribute('disabled', '')
    }
    return eBtn.removeAttribute('disabled')
  })
}