const URL = 'http://localhost:3000/'

const textCountBtn = document.querySelectorAll('.text-count-btn')
const textCountArea = document.querySelectorAll('.text-count-area')
const textCountNumber = document.querySelectorAll('.text-count-number')

const likeSubmitBtn = document.querySelectorAll('.like-submit-btn')

likeSubmitBtn.forEach(item => {
  item.addEventListener('click', async e => {
    const tweetId = item.dataset.tweetid
    const likedIcon = item.querySelector('.like')
    const likedNumbers = item.querySelector('.liked-numbers') || ''
    if (item.classList.contains('liked')) {
      likedNumbers.textContent--
      item.classList.toggle('liked')
      likedIcon.classList.toggle('user-like')
      await axios({ method: 'post', url: `${URL}tweets/${tweetId}/unlike` })
    } else {
      likedNumbers.textContent++
      item.classList.toggle('liked')
      likedIcon.classList.toggle('user-like')
      await axios({ method: 'post', url: `${URL}tweets/${tweetId}/like` })
    }
  })
})

textCountArea.forEach((textArea, i) => {
  textArea.addEventListener('keyup', e => textCount(e, textCountBtn[i], textCountNumber[i]))
})

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
