async function likeOfProfile (button) { 
  const tweetId = button.parentElement.id
  const likeCountElement = document.querySelector('.like.number');
  try {
    if (!button.classList.contains('liked')) {
      const response = await fetch(`/api/tweets/${tweetId}/like`, { method: 'POST' })
      const data = await response.json()
      likeCountElement.textContent = data.likeCount
      if (data.isLiked) button.classList.toggle('liked') //remove liked
    } else if (button.classList.contains('liked')){
      const response = await fetch(`/api/tweets/${tweetId}/like`, { method: 'DELETE' })
      const data = await response.json()
      likeCountElement.textContent = data.likeCount
      if (data.isLiked === false) button.classList.toggle('liked') //add liked
    }

  } catch (error) {
    console.error(error)
  }
}

