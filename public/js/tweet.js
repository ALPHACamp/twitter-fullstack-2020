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

async function reply(button) {
  const tweetId = button.parentElement.parentElement.id
  const templateSource = document.getElementById('tweet-template')
  const tweetHTML = document.querySelector('.reply.modal .tweet')
  try {
    console.log('11')
    const response = await fetch(`/api/tweets/${tweetId}/`, { method: 'GET' })
    const data = await response.json()
    const template =  Handlebars.compile(templateSource.innerHTML);
    const html =  template({ tweet: data.tweet });
    console.log(html)
    tweetHTML.innerHTML = html

  } catch (error) {
    console.error(error)
  }
}


async function postReply(id, input) {
  try {
    const response = await fetch(`/api/tweets/${id}/replies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reply: input.value })
    });

    if (response.ok) {
      // Tweet posted successfully
      const data = await response.json();
      console.log(data);
      input.value = null
      location.reload(true)
    } else {
      // Error posting tweet
      const error = await response.text();
      console.error(error);
    }
  } catch (error) {
    // Network error
    console.error(error);
  }
}