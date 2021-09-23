const tweetLike = document.querySelector('.tweet-like-axios')

tweetLike.addEventListener('click', function onIconClicked(event) {
  const baseURL = event.target.dataset.url
  const tweetId = event.target.dataset.id
  if (event.target.matches('.like-icon')) {
    console.log('click like-icon')
    axios.post(`${baseURL}/tweets/${tweetId}/like`)
      .then(message => {
        event.target.classList.toggle("like-icon")
        event.target.classList.toggle("unlike-icon")
        event.target.classList.toggle("fas")
        event.target.classList.toggle("far")
        let likePlus = Number(event.target.nextElementSibling.innerText)
        likePlus += 1
        event.target.nextElementSibling.innerText = likePlus
      })
  }

  if (event.target.matches('.unlike-icon')) {
    console.log('click unlike-icon')
    axios.post(`${baseURL}/tweets/${tweetId}/unlike?_method=DELETE`)
      .then(message => {
        event.target.classList.toggle("like-icon")
        event.target.classList.toggle("unlike-icon")
        event.target.classList.toggle("fas")
        event.target.classList.toggle("far")
        let likePlus = Number(event.target.nextElementSibling.innerText)
        likePlus -= 1
        event.target.nextElementSibling.innerText = likePlus
      })
  }
})