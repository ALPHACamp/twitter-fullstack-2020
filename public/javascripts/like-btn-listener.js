const likeSubmitBtn = document.querySelectorAll('.like-submit-btn')
const likedIcon = document.querySelectorAll('.like') || ''
const likedNumbers = document.querySelectorAll('.like-count') || ''

likeSubmitBtn.forEach((btn, i) => {
  btn.addEventListener('click', async e => {
    try {
      const tweetId = btn.dataset.tweetid || ''
      if (btn.matches('.liked')) {
        likedNumbers[i].textContent--
        btn.classList.toggle('liked')
        likedIcon[i].classList.toggle('outline-like')
        await axios.post(`/tweets/${tweetId}/unlike`)
      } else {
        likedNumbers[i].textContent++
        btn.classList.toggle('liked')
        likedIcon[i].classList.toggle('outline-like')
        await axios.post(`/tweets/${tweetId}/like`)
      }
    } catch (err) {
      console.log(err)
    }
  })
})
