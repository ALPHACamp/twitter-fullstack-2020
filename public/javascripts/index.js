const URL = 'http://localhost:3000/'

const sidePostSubmitBtn = document.querySelector('.side-post-btn')
const sidePostSubmitArea = document.querySelector('.side-post-description')
const sidePostSpan = document.querySelector('.side-post-number')

const homePostSubmitBtn = document.querySelector('.home-post-btn')
const homePostSubmitArea = document.querySelector('.home-post-description')
const homePostSpan = document.querySelector('.home-post-number')

const likeSubmitBtn = document.querySelectorAll('.like-submit-btn')

likeSubmitBtn.forEach(item => {
  item.addEventListener('click', async e => {
    const tweetId = item.dataset.tweetid
    const likedIcon = item.querySelector('.like')
    const likedNumbers = item.querySelector('.liked-numbers')
    if (item.classList.contains('liked')) {
      likedNumbers.textContent--
      item.classList.toggle('liked')
      likedIcon.classList.toggle('user-like')
      await axios({ method: 'post', url: `${URL}tweets/${tweetId}/unlike` })
      return
    }
    if (!item.classList.contains('liked')) {
      likedNumbers.textContent++
      item.classList.toggle('liked')
      likedIcon.classList.toggle('user-like')
      await axios({ method: 'post', url: `${URL}tweets/${tweetId}/like` })
    }
  })
})

sidePostSubmitArea.addEventListener('keyup', e => textCount(e, sidePostSubmitBtn, sidePostSpan))
homePostSubmitArea.addEventListener('keyup', e => textCount(e, homePostSubmitBtn, homePostSpan))

function textCount (e, submitBtn, textNumber) {
  submitBtn = submitBtn || ''
  textNumber = textNumber || ''
  const target = e.target
  const maxLength = target.getAttribute('maxlength')
  const currentText = target.value.trim()
  const currentLength = currentText ? target.value.length : 0
  if (currentLength > 0 || currentLength <= maxLength) {
    submitBtn.removeAttribute('disabled')
  }
  if (currentLength === 0) {
    submitBtn.setAttribute('disabled', '')
  }
  textNumber.textContent = currentLength
}
