const tweetLike = document.querySelector('#tweet-like')
const tweetLikeCount = document.querySelector('#tweet-like-count')

tweetLike.addEventListener('click', function onIconClicked(event) {
  const baseURL = event.target.dataset.url
  const tweetId = event.target.dataset.id
  if (event.target.matches('.like-icon')) {
    axios.post(`${baseURL}/tweets/${tweetId}/like`)
      .then(message => {
        event.target.classList.toggle("like-icon")
        event.target.classList.toggle("unlike-icon")
        event.target.classList.toggle("fas")
        event.target.classList.toggle("far")
        let likePlus = Number(tweetLikeCount.innerText)
        likePlus += 1
        tweetLikeCount.innerText = likePlus
      })
  }

  if (event.target.matches('.unlike-icon')) {
    axios.post(`${baseURL}/tweets/${tweetId}/unlike`)
      .then(message => {
        event.target.classList.toggle("like-icon")
        event.target.classList.toggle("unlike-icon")
        event.target.classList.toggle("fas")
        event.target.classList.toggle("far")
        let likePlus = Number(tweetLikeCount.innerText)
        likePlus -= 1
        tweetLikeCount.innerText = likePlus
      })
  }
})