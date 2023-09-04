const container = document.querySelector('.scrollbar-hidden')
const TWEETS_LIMIT = 8
let mainTweetsPage = 0

container.addEventListener('scroll', unlimitDraw)
async function unlimitDraw () {
  if (container.scrollHeight - container.scrollTop <= container.clientHeight + 100) {
    mainTweetsPage += 1
    const link = `/tweets/tweetsUnload?limit=${TWEETS_LIMIT}&page=${mainTweetsPage}`
    let moreTweets = await loadMoreData(link)
    if (!moreTweets.data || !moreTweets.data.length) {
      container.removeEventListener('scroll', unlimitDraw)
      return null
    }

    moreTweets = moreTweets.data.map(tweet => {
      let likeBtn = ''
      if (!tweet.isLiked) {
        likeBtn = `
              <form action="/tweets/${tweet.id}/like" method="post">
                <button href="#"
                  class="btn border-0 btn-outline-light p-0 m-0 d-flex align-items-center gap-2 link-unstyled">
                  <img src="/images/icons/icon_like_outlined.svg" alt="" class="img-fluid center tweet-action-icon">
                  <p class="font-size-sm m-0 text-secondary">${tweet.likes}</p>
                </button>
              </form>
        `
      } else {
        likeBtn = `
              <form action="/tweets/${tweet.id}}/unlike" method="post">
                <button href="#"
                  class="btn border-0 btn-outline-light p-0 m-0 d-flex align-items-center gap-2 link-unstyled">
                  <img src="/images/icons/icon_like_filled.svg" alt=""
                    class="filter-red-color img-fluid center tweet-action-icon">
                  <p class="font-size-sm m-0 text-secondary">${tweet.likes}</p>
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
                <p class="font-size-sm text-secondary">@${tweet.User.account}・${tweet.createdFromNow}</p>
              </a>
            </div>
            <p class="m-0 text-wrap text-break">
              ${tweet.description}
            </p>
            <div class="tweet-user-action d-flex justify-content-between">
              <button type="button"
                class="btn border-0 btn-outline-light d-flex align-items-center gap-2 link-unstyled p-0 m-0"
                data-bs-toggle="modal" data-bs-target="#reply-model">
                <img src="/images/icons/icon_reply_outlined.svg" alt="" class="img-fluid center tweet-action-icon">
                <p class="font-size-sm m-0 text-secondary">${tweet.replies}</p>
              </button>
              ${likeBtn}
            </div>
          </div>
        </div>
      </div>
        `
      return html
    })
    container.innerHTML += moreTweets.join('')
    tweets = document.querySelectorAll(TWEET_CARD_CLASS)
    tweets.forEach(tweet => {
      tweet.removeEventListener('click', tweetDirectToLink)
      tweet.addEventListener('click', tweetDirectToLink)
      tweet.removeEventListener('click', renderReplyModal)
      tweet.addEventListener('click', renderReplyModal)
    })
  }
}
