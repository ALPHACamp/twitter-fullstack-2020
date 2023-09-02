const container = document.querySelector('.scrollbar-hidden')
const userId = href[href.length - 2]
const USER_TWEETS_LIMIT = 8
let mainUserTweetsPage = 0

container.addEventListener('scroll', async () => {
  if (container.scrollHeight - container.scrollTop <= container.clientHeight + 100) {
    mainUserTweetsPage += 1
    const link = `/users/${userId}/tweetsUnload?limit=${USER_TWEETS_LIMIT}&page=${mainUserTweetsPage}`
    let moreUserTweets = await loadMoreData(link)
    if (!moreUserTweets.data) {
      return null
    }

    moreUserTweets = moreUserTweets.data.map(tweet => {
      let likeBtn = ''
      if (tweet.isLiked) {
        likeBtn = `
        <form action="/tweets/${tweet.id}/unlike" method="post">
          <button href="#"
            class="btn border-0 btn-outline-light p-0 m-0 d-flex align-items-center gap-2 link-unstyled">
            <img src="/images/icons/icon_like_filled.svg" alt=""
              class="filter-red-color img-fluid center tweet-action-icon">
            <p class="font-size-sm m-0 text-secondary">${tweet.countLike}</p>
          </button>
        </form>
        `
      } else {
        likeBtn = `
        <form action="/tweets/${tweet.id}/like" method="post">
          <button href="#"
            class="btn border-0 btn-outline-light p-0 m-0 d-flex align-items-center gap-2 link-unstyled">
            <img src="/images/icons/icon_like_outlined.svg" alt="" class="img-fluid center tweet-action-icon">
            <p class="font-size-sm m-0 text-secondary">${tweet.countLike}</p>
          </button>
          </form>
        `
      }

      const html = `
      <div data-link="/tweets/${tweet.id}/replies" data-id="${tweet.id}"
        class="tweet-card card  shadow-none  py-0 px-4 m-0 rounded-0  border-1px border-bottom-1 border-top-0 border-start-0 border-end-0">
        <div class="card-body m-0 p-0 pb-3 d-flex gap-2">

          <div class="tweet-user-icon flex-shrink-0  p-0">
            <a href="/users/${tweet.User.id}/tweets"
              class="overflow-hidden  rounded-circle link-unstyled  child-img-center w-100 h-100 p-0">
              <img src="${tweet.User.avatar}" alt="" class="w-100 h-100">
            </a>
          </div>
          <div class="tweet-card-content d-flex flex-column gap-2">

            <div class="tweet-user-horizontal">
              <a href="/users/${tweet.User.id}/tweets" class=" d-flex gap-2 link-unstyled align-items-center">
                <p class="fw-bold">${tweet.User.name}</p>
                <p class="font-size-sm text-secondary">@${tweet.User.account}・${tweet.createdAt}</p>
              </a>
            </div>
            <p class="m-0 text-break">
              ${tweet.description}
            </p>

            <div class="tweet-user-action d-flex justify-content-between">
              <button type="button" class="btn btn-outline-light d-flex align-items-center gap-2 link-unstyled p-0 m-0"
                data-bs-toggle="modal" data-bs-target="#reply-model">
                <img src="/images/icons/icon_reply_outlined.svg" alt="" class="img-fluid center tweet-action-icon">
                <p class="font-size-sm m-0 text-secondary">${tweet.countReply}</p>
              </button>
              ${likeBtn}
            </div>
          </div>

        </div>
        <div class="bottom-border"></div>
      </div>
        `
      return html
    })
    container.innerHTML += moreUserTweets.join('')
    tweets = document.querySelectorAll(TWEET_CARD_CLASS)
    tweets.forEach(tweet => {
      tweet.removeEventListener('click', tweetDirectToLink)
      tweet.addEventListener('click', tweetDirectToLink)
    })
  }
})
