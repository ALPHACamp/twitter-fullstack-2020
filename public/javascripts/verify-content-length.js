
'use strict'

// 中間發文
const tweetForm = document.querySelector('#tweet-form') || ''
const tweetTextArea = document.querySelector(".description-input") || ''
const tweetDescriptionLength = document.querySelector("#description-length") || ''
const tweetSendBtn = document.querySelector("#center-send-button") || ''

if (tweetForm) {
  tweetTextArea.addEventListener('keyup', function (event) {
    if (tweetTextArea.value.length === 0) {
      tweetSendBtn.setAttribute('disabled', '')
      tweetDescriptionLength.classList.remove('text-black-50')
      tweetDescriptionLength.classList.add('text-error')
      tweetDescriptionLength.textContent = '內容不可空白'
    }
    if (tweetTextArea.value.length > 0) {
      tweetSendBtn.removeAttribute('disabled')
      tweetDescriptionLength.classList.add('text-black-50')
      tweetDescriptionLength.classList.remove('text-error')
      tweetDescriptionLength.textContent = tweetTextArea.value.length + '/140'
    }
    if (tweetTextArea.value.length > 140) {
      tweetSendBtn.setAttribute('disabled', '')
      tweetDescriptionLength.classList.remove('text-black-50')
      tweetDescriptionLength.classList.add('text-error')
      tweetDescriptionLength.textContent = '字數不可超過140字 , ' + tweetTextArea.value.length + '/140'
    }
  })

  tweetForm.addEventListener('submit', function (event) {
    if (tweetTextArea.value.length <= 0) {
      event.preventDefault()
      event.stopPropagation()
    }
    if (tweetTextArea.value.length > 140) {
      event.preventDefault()
      event.stopPropagation()
    }
  })
}

// 側邊推文modal
const sideForm = document.querySelector('#side-form') || ''
const sideTextArea = document.querySelector(".side-description-input") || ''
const sideDescriptionLength = document.querySelector("#side-description-length") || ''
const sideTweetBtn = document.querySelector("#side-btn-send") || ''

if (sideForm) {
  sideForm.addEventListener('keyup', function (event) {
    if (sideTextArea.value.length === 0) {
      sideTweetBtn.setAttribute('disabled', '')
      sideDescriptionLength.classList.remove('text-black-50')
      sideDescriptionLength.classList.add('text-error')
      sideDescriptionLength.textContent = '內容不可空白'
    }
    if (sideTextArea.value.length > 0) {
      sideTweetBtn.removeAttribute('disabled')
      sideDescriptionLength.classList.add('text-black-50')
      sideDescriptionLength.classList.remove('text-error')
      sideDescriptionLength.textContent = sideTextArea.value.length + '/140'
    }
    if (sideTextArea.value.length > 140) {
      sideTweetBtn.setAttribute('disabled', '')
      sideDescriptionLength.classList.remove('text-black-50')
      sideDescriptionLength.classList.add('text-error')
      sideDescriptionLength.textContent = '字數不可超過140字 , ' + sideTextArea.value.length + '/140'
    }
  })

  sideForm.addEventListener('submit', function (event) {
    if (sideTextArea.value.length <= 0) {
      event.preventDefault()
      event.stopPropagation()
    }
    if (sideTextArea.value.length > 140) {
      event.preventDefault()
      event.stopPropagation()
    }
  })
}

// 回復推文按鈕監聽跟modal
const replyForm = document.querySelectorAll('.reply-form') || ''
const replyTextArea = document.querySelectorAll(".reply-description-input") || ''
const replyDescriptionLength = document.querySelectorAll(".reply-description-length") || ''
const replyTweetBtn = document.querySelectorAll(".reply-btn-send") || ''

if (replyForm) {
  replyForm.forEach((form, i) => {
    replyForm[i].addEventListener('keyup', e => {
      if (replyTextArea[i].value.length === 0) {
        replyTweetBtn[i].setAttribute('disabled', '')
        replyDescriptionLength[i].classList.remove('text-black-50')
        replyDescriptionLength[i].classList.add('text-error')
        replyDescriptionLength[i].textContent = '內容不可空白'
      }
      if (replyTextArea[i].value.length > 0) {
        replyTweetBtn[i].removeAttribute('disabled')
        replyDescriptionLength[i].classList.add('text-black-50')
        replyDescriptionLength[i].classList.remove('text-error')
        replyDescriptionLength[i].textContent = replyTextArea[i].value.length + '/140'
      }
      if (replyTextArea[i].value.length > 140) {
        replyTweetBtn[i].setAttribute('disabled', '')
        replyDescriptionLength[i].classList.remove('text-black-50')
        replyDescriptionLength[i].classList.add('text-error')
        replyDescriptionLength[i].textContent = '字數不可超過140字 , ' + replyTextArea[i].value.length + '/140'
      }
    })
  })

  replyForm.forEach((form, i) => {
    replyForm[i].addEventListener('click', async e => {
      if (e.target.classList.contains('reply-btn-send')) {
        e.preventDefault()
        e.stopPropagation()
        let userId = e.target.dataset.userid
        let tweetId = e.target.dataset.tweetid
        let comment = document.querySelector(`#comment-${tweetId}`)
        await axios.post(`/tweets/${tweetId}/replies`, {
          UserId: userId,
          TweetId: tweetId,
          comment: comment.value
        })
        comment.value = ''
        const count = document.querySelector(`#reply-count-${tweetId}`)
        const amount = Number(count.textContent) + 1
        count.textContent = amount
      }
    })
  })
}
