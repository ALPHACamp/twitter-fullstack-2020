
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
    const response = await fetch(`/api/tweets/${tweetId}/`, { method: 'GET' })
    const data = await response.json()
    const template = Handlebars.compile(templateSource.innerHTML);
    const html = template({ tweet: data.tweet });
    tweetHTML.innerHTML = html

  } catch (error) {
    console.error(error)
  }
}

async function postTweet(input) {
  try {
    if (input.value.length > 140) throw new Error('推文長度上限為 140 個字元！')
    if (input.value.length === 0) throw new Error('內容不可為空白！')
    const response = await fetch('/api/tweets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tweet: input.value })
    });

    if (response.ok) {
      // Tweet posted successfully
      // input.value = null
      // document.querySelector('span.error-message').innerText = null
      postNotification('green', '推文成功', 'top')
      setTimeout(function() {
        location.reload(true);
      }, 1000);
    } else {
      // Error posting tweet
      const error = await response.json();
      input.nextElementSibling.innerText = error.message
    }
  } catch (error) {
    // Network error
    input.nextElementSibling.innerText = error.message
  }
}


async function postReply(id, input) {
  try {
    if (input.value.length > 140) throw new Error('回覆長度上限為 140 個字元！')
    if (input.value.length === 0) throw new Error('內容不可為空白！')
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
      // input.value = null
      // document.querySelector('span.error-message').innerText = null
      postNotification('green', '回覆成功', 'top')
      setTimeout(function() {
        location.reload(true);
      }, 1000);
    } else {
      // Error posting tweet
      const error = await response.json();
      document.querySelector('span.error-message').innerText = error.message
      // console.error(error);
    }
  } catch (error) {
    // Network error
    input.nextElementSibling.innerText = error.message
  }
}


async function likeOfProfile(button) {
  const tweetId = button.parentElement.id
  const likeCountElement = document.querySelector('.like.number');
 
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

async function replyOfProfile(button) {
  const tweetId = button.parentElement.id
  const templateSource = document.getElementById('tweet-template')
  const tweetHTML = document.querySelector('.reply.modal .tweet')
  try {
    const response = await fetch(`/api/tweets/${tweetId}/`, { method: 'GET' })
    const data = await response.json()
    const template = Handlebars.compile(templateSource.innerHTML);
    const html = template({ tweet: data.tweet });
    tweetHTML.innerHTML = html

  } catch (error) {
    console.error(error)
  }
}
