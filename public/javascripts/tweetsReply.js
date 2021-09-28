const tweets = document.querySelector('.tweet-reply-axios')
const tweetReplyModal = document.querySelector('#tweetReplyModal')
const replyValidForm = document.querySelector('.reply-valid-form')
const tweetReplyModalAvatar = document.querySelector('#tweet-reply-modal-avatar')
const tweetReplyModalDescription = document.querySelector('#tweet-reply-modal-description')
const tweetReplyModalName = document.querySelector('#tweet-reply-modal-name')
const tweetReplyModalAccount = document.querySelector('#tweet-reply-modal-account')

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
        // 因先前用innerHTML整個FORM架構被置換，雖然ID CLASS內容沒改變，但監聽器卻失效，故改變想法只更換需要更換的內容嘗試
        replyValidForm.action = `/tweets/${tweetModal.id}/replies`
      })

  }
})