function displayUserTweets (data) {
  const userTweets = data.userTweets
  data.userTweets.map(item => {
    item.likes = item.likes.map(i => i.UserId)
  })
  let tweetsHTML = ''
  return (
    tweetsHTML += userTweets.reduce((acc, item) => {
      acc =+ `
      <div class="tweet">
        <div class="twitter-avatar">
          <a href="/users/${data.id}">
            <img src="${data.avatar}" alt="" class="tweets-img">
          </a>
        </div>
        <div class="tweet-content-box">
          <div class="twitter-info">
            <a href="/tweets/${item.id}/replies" class="reply-link">
              <span>${data.name}</span>
              <span class="twitter-account">${data.account}</span>
              <span class="twitter-dot">。</span>
              <span class="twitter-createdAt">${item.createdAt}</span>
            </a>
          </div>
        <div class="tweet-content">${item.description}</div>
        <div class="tweet-feedback">
        `
        if (item.likes.includes(data.id)) {
          +
          `
          <form action="/tweets/${item.id}/unlike" method="post">
          `
        } else {
          +
          `
          <form action="/tweets/${item.id}/like" method="post">
          `
        }
          +
          `
            <button type="button" class="goto-comment" data-tweetid="${item.id}" data-avatar="${data.avatar}"
              data-name="${data.name}" data-accountname="${data.account}"
              data-createtime="${item.createdAt}" data-tweetcontent="${item.description}"
              data-useravatar="${data.avatar}">
              <i class="far fa-comment comment-icon"></i>
              <span class="reply-sum comment-icon">${item.replies.length}</span>
            </button>
            <button type="submit" class="post-like">
              <i class="fas fa-heart like-heart"></i>
              <span class="like-sum">${item.likes.length}</span>
            </button>
          </form>
          </div>
        </div>
      </div>
      `
       
    }, '')
  )
}

module.exports = displayUserTweets
