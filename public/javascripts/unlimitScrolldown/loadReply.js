const container = document.querySelector('.scrollbar-hidden')
const userId = href[href.length - 2]
const REPLY_LIMIT = 8
let mainRepliesPage = 0

container.addEventListener('scroll', async () => {
  if (container.scrollHeight - container.scrollTop <= container.clientHeight + 100) {
    mainRepliesPage += 1
    const link = `/tweets/${userId}/repliesUnload?limit=${REPLY_LIMIT}&page=${mainRepliesPage}`
    let moreReplies = await loadMoreData(link)
    console.log(link)
    if (!moreReplies.data) {
      return null
    }

    moreReplies = moreReplies.data.Replies.map(reply => {
      const html = `
      <div
      class="tweet-card card  shadow-none  py-0 px-4 m-0 rounded-0  border-1px border-bottom-1 border-top-0 border-start-0 border-end-0">
      <div class="card-body m-0 p-0 pb-3 d-flex gap-2">
        <div class="tweet-user-icon flex-shrink-0  p-0">
          <a href="/users/${reply.User.id}/tweets"
            class="overflow-hidden  rounded-circle link-unstyled  child-img-center w-100 h-100 p-0">
            <img src="${reply.User.avatar}" alt="" class="w-100 h-100">
          </a>
        </div>
        <div class="tweet-card-content d-flex flex-column gap-2">

          <div class="tweet-user-horizontal">
            <a href="/users/${reply.User.id}/tweets" class=" d-flex gap-2 link-unstyled align-items-center">
              <p class="fw-bold">${reply.User.name}</p>
              <p class="font-size-sm text-secondary">@${reply.User.account}・${reply.createdAt}</p>
            </a>
          </div>

          <div class="tweet-user-replied">
            <a href="/users/${moreReplies.data.User.id}/tweets" class=" d-flex gap-2 link-unstyled align-items-center">
              <p class="font-size-sm text-secondary">回覆</p>
              <p class="font-size-sm main-color">@${moreReplies.data.User.account}</p>
            </a>
          </div>
          <p class="m-0 text-wrap text-break">
            ${reply.comment}
          </p>
        </div>
      </div>
    </div>
        `
      return html
    })
    container.innerHTML += moreReplies.join('')
    tweets = document.querySelectorAll(TWEET_CARD_CLASS)
    tweets.forEach(tweet => {
      tweet.removeEventListener('click', tweetDirectToLink)
      tweet.addEventListener('click', tweetDirectToLink)
    })
  }
})
