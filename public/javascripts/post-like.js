const likeSubmitBtn = document.querySelectorAll('.like-submit-btn')
const likedIcon = document.querySelectorAll('.like') || ''
const likedNumbers = document.querySelectorAll('.liked-numbers') || ''

likeSubmitBtn.forEach((item, i) => {
  item.addEventListener('click', async e => {
    try {
      const tweetId = item.dataset.tweetid || ''
      // const likedIcon = document.querySelector('.like') || ''
      // const likedNumbers = document.querySelector('.liked-numbers') || ''
      if (item.classList.contains('liked')) {
        likedNumbers[i].textContent--
        item.classList.toggle('liked')
        likedIcon[i].classList.toggle('user-like')
        await axios({ method: 'post', url: `${BASE_URL}tweets/${tweetId}/unlike` })
        // await axios.post(`tweets/${tweetId}/unlike`)
      } else {
        likedNumbers[i].textContent++
        item.classList.toggle('liked')
        likedIcon[i].classList.toggle('user-like')
        await axios({ method: 'post', url: `${BASE_URL}tweets/${tweetId}/like` })
        // await axios.post(`tweets/${tweetId}/like`)
      }
    } catch (err) {
      console.log(err)
    }
  })
})
