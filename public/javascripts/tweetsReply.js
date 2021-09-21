const tweets = document.querySelector('.tweet-reply-axios')
const tweetReplyModalAvatar = document.querySelector('#tweet-reply-modal-avatar')
const tweetReplyModalDescription = document.querySelector('#tweet-reply-modal-description')
const tweetReplyModalName = document.querySelector('#tweet-reply-modal-name')
const tweetReplyModalAccount = document.querySelector('#tweet-reply-modal-account')
const tweetReplyModalReply = document.querySelector('#tweet-reply-modal-reply')

tweets.addEventListener('click', function onIconClicked(event) {
  const baseURL = event.target.dataset.url
  const tweetId = event.target.dataset.id
  if (event.target.matches('.reply-icon')) {
    axios.get(`${baseURL}/api/tweets/${tweetId}/replies`)
      .then(tweet => {
        const tweetModal = tweet.data.tweetModal
        tweetReplyModalAvatar.innerHTML = `
              <a href="/users/${tweetModal.UserId}/tweets">
            <img class="rounded-circle" src="${tweetModal.User.avatar}" alt="avatar" title="avatar" width="50px" height="50px">
            </a>
            `
        tweetReplyModalName.innerHTML = `
              <a href="/users/${tweetModal.UserId}/tweets">
              <span class="name">${tweetModal.User.name}</span>
              <span class="account">&nbsp;${tweetModal.User.account}</span>
              </a>
              <span class="time"><b>•</b>&nbsp;${tweetModal.createdAt}</span>
            `
        tweetReplyModalDescription.innerText = tweetModal.description
        tweetReplyModalAccount.innerHTML = `
              <span class="reply-to">回覆給</span>
              <span class="reply-account">&nbsp;${tweetModal.User.account}</span>
            `
        tweetReplyModalReply.innerHTML = `
              <form class="needs-validation" action="/tweets/${tweetModal.id}/replies" method="POST" novalidate>
              <textarea class="form-control tweet-modal-textarea w-100" id="comment" name="comment" rows="9"
              placeholder="推你的回覆" required></textarea>
              <div class="tweet-modal-textarea-feedback invalid-feedback">
              內文不可以空白
              </div>
              <button type="submit" class="btn rounded-pill fw-bolder common-button tweet-modal-tweet-btn"
              onclick="return(confirm('確認回覆了嗎？'))">
              回覆
              </button>
              </form>
            `
      })

  }
})