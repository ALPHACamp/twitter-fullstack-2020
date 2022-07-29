
'use strict'

// 中間發文
const tweetForm = document.querySelector('#tweet-form')
const tweetTextArea = document.querySelector(".description-input")
const tweetDescriptionLength = document.querySelector("#description-length")

tweetTextArea.addEventListener('input', function (event) {
  if (tweetTextArea.value.length > 0) {
    tweetDescriptionLength.classList.add('text-black-50')
    tweetDescriptionLength.classList.remove('text-error')
    tweetDescriptionLength.textContent = tweetTextArea.value.length + '/140'
  }
  if (tweetTextArea.value.length >= 140) {
    tweetDescriptionLength.classList.remove('text-black-50')
    tweetDescriptionLength.classList.add('text-error')
    tweetDescriptionLength.textContent = '字數不可超過140字'
  }
})

tweetForm.addEventListener('submit', function (event) {
  if (tweetTextArea.value.length <= 0) {
    event.preventDefault()
    event.stopPropagation()
    tweetDescriptionLength.classList.remove('text-black-50')
    tweetDescriptionLength.classList.add('text-error')
    tweetDescriptionLength.textContent = '內容不可空白'
  }
  tweetForm.classList.add('was-validated')
})

// 側邊推文modal
const sideForm = document.querySelector('#side-form')
const sideTextArea = document.querySelector(".side-description-input")
const sideDescriptionLength = document.querySelector("#side-description-length")
const sideTweetBtn = document.querySelector("#side-btn-send")

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
  if (sideTextArea.value.length >= 140) {
    sideDescriptionLength.classList.remove('text-black-50')
    sideDescriptionLength.classList.add('text-error')
    sideDescriptionLength.textContent = '字數不可超過140字'
  }
})

sideForm.addEventListener('submit', function (event) {
  if (sideTextArea.value.length <= 0) {
    event.preventDefault()
    event.stopPropagation()
    sideForm.classList.remove('text-black-50')
    sideForm.classList.add('text-error')
    sideForm.textContent = '內容不可空白'
  }
})

// 回復推文modal
const replyForm = document.querySelectorAll('.reply-form')
const replyTextArea = document.querySelectorAll(".reply-description-input")
const replyDescriptionLength = document.querySelectorAll(".reply-description-length")
const replyTweetBtn = document.querySelectorAll(".reply-btn-send")

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
    if (replyTextArea[i].value.length >= 140) {
      replyDescriptionLength[i].classList.remove('text-black-50')
      replyDescriptionLength[i].classList.add('text-error')
      replyDescriptionLength[i].textContent = '字數不可超過140字'
    }
  })
})

replyForm.forEach((form, i) => {
  replyForm[i].addEventListener('submit', e => {
    if (replyTextArea[i].value.length <= 0) {
      e.preventDefault()
      e.stopPropagation()
      replyForm[i].classList.remove('text-black-50')
      replyForm[i].classList.add('text-error')
      replyForm[i].textContent = '內容不可空白'
    }
  })
})
