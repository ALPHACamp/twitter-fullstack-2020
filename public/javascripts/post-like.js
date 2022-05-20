const likeSubmitBtn = document.querySelectorAll('.like-submit-btn')

likeSubmitBtn.forEach(item => {
  item.addEventListener('click', async e => {
    try {
      const tweetId = item.dataset.tweetid
      const likedIcon = item.querySelector('.like')
      const likedNumbers = item.querySelector('.liked-numbers') || ''
      if (item.classList.contains('liked')) {
        likedNumbers.textContent--
        item.classList.toggle('liked')
        likedIcon.classList.toggle('user-like')
        await axios({ method: 'post', url: `${BASE_URL}tweets/${tweetId}/unlike` })
        // await axios.post(`tweets/${tweetId}/unlike`)
      } else {
        likedNumbers.textContent++
        item.classList.toggle('liked')
        likedIcon.classList.toggle('user-like')
        await axios({ method: 'post', url: `${BASE_URL}tweets/${tweetId}/like` })
        // await axios.post(`tweets/${tweetId}/like`)
      }
    } catch (err) {
      console.log(err)
    }
  })
})
