async function like(button) {
  const tweetId = button.parentElement.parentElement.id
  const likeCountElement = button.nextElementSibling
  try {
    if (!button.classList.contains('liked')) {
      const response = await fetch(`/api/tweets/${tweetId}/like`, { method: 'POST' })
      const data = await response.json()
      likeCountElement.textContent = data.likeCount
      if (data.isLiked) button.classList.toggle('liked') //remove liked
    } else if (button.classList.contains('liked')) {
      const response = await fetch(`/api/tweets/${tweetId}/like`, { method: 'DELETE' })
      const data = await response.json()
      likeCountElement.textContent = data.likeCount
      if (data.isLiked === false) button.classList.toggle('liked') //add liked
    }

  } catch (error) {
    console.error(error)
  }
}

