//確認推文送出的字數限制與相關訊息

const tweetText = document.querySelector('#tweetText')
const tweetTextBtn = document.querySelector('#tweetTextBtn')
const mainTweetText = document.querySelector('#mainTweetText')
const mainTweetTextBtn = document.querySelector('#mainTweetTextBtn')
const mainReplyBtn = document.querySelector('#mainReplyBtn')
const mainReplyText = document.querySelector('#mainReplyText')
const tweetTip = document.querySelector('#tweetTip')
const mainTweetTip = document.querySelector('#mainTweetTip')

if (tweetText)
  listenText(tweetText, tweetTextBtn, tweetTip)

if (mainTweetText)
  listenText(mainTweetText, mainTweetTextBtn, mainTweetTip)

if (mainReplyBtn)
  listenText(mainReplyText, mainReplyBtn)


function listenText(eText, eBtn, eTip) {
  eBtn.setAttribute('disabled', '')
  if (eTip)
    eTip.classList.add('tweetWordTipError')
  eText.addEventListener('input', (e) => {
    const textLength = eText.value.trim().length
    if (textLength === 0 || textLength > 140) {
      if (eTip) {
        eTip.innerText = textLength
        eTip.classList.add('tweetWordTipError')
        eTip.classList.remove('tweetWordTipNormal')
      }
      return eBtn.setAttribute('disabled', '')
    }
    if (eTip) {
      eTip.innerText = textLength
      eTip.classList.add('tweetWordTipNormal')
      eTip.classList.remove('tweetWordTipError')
    }
    return eBtn.removeAttribute('disabled')
  })
}