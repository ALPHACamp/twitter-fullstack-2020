async function follow(button) {
  try {
    if (!button.classList.contains('followed')) {
      const response = await fetch(`/api/users/${button.id}/follow`, { method: 'POST' })
      const data = await response.json()
      if (data.isFollowed) button.classList.toggle('followed') //remove followed
    } else if (button.classList.contains('followed')) {
      const response = await fetch(`/api/users/${button.id}/follow`, { method: 'DELETE' })
      const data = await response.json()
      if (data.isFollowed === false) button.classList.toggle('followed') //add followed
    }

  } catch (error) {
    console.error(error)
  }
}

