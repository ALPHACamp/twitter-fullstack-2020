// 直接load axios檔案在javascript中所以不用再import
// import axios from 'axios'
const container = document.querySelector('.scrollbar-hidden')
const TWEETS_LIMIT = 12
let tweetsPage = 0

const deleteTweetModal = document.getElementById('deleteTweetModal')

deleteTweetModal.addEventListener('shown.bs.modal', function () {
  document.body.classList.add('modal-open')
})

deleteTweetModal.addEventListener('hidden.bs.modal', function () {
  document.body.classList.remove('modal-open')
})

const deleteButtons = document.querySelectorAll('.admin-delete-btn')
deleteButtons.forEach(button => {
  button.removeEventListener('click', removeTweet)
  button.addEventListener('click', removeTweet)
})
container.addEventListener('scroll', async () => {
  if (container.scrollHeight - container.scrollTop <= container.clientHeight + 10) { // 拉到往上10公分時就會 reload
  // 這裡是到達底部時需要執行的代碼，例如發送請求從 DB 加載更多數據
    let moreTweets = await loadMoreTweets()

    if (!moreTweets.data) {
      return null
    }

    moreTweets = moreTweets.data.map(tweet => {
      const html = `
      <div
        data-id="${tweet.id}"
        class="admin-tweet-card card shadow-none py-0 px-4 border-1px border-bottom-1 border-top-0 border-start-0 border-end-0">
        <div class="card-body m-0 pb-3 d-flex gap-2">
          <div class="tweet-user-icon flex-shrink-0 p-0">
            <a
              href="/api/users/${tweet.User.id}"
              class="overflow-hidden rounded-circle link-unstyled child-img-center w-100 h-100 p-0">
              <img src="${tweet.User.avatar}" alt="" class="w-100 h-100" />
            </a>
          </div>
          <div class="tweet-card-content d-flex flex-column gap-2 w-100">
            <div
              class="p-0 m-0 d-flex justify-content-between align-items-center">
              <div class="tweet-user-horizontal">
                <a
                  href="/api/users/${tweet.User.id}"
                  class="d-flex gap-2 link-unstyled align-items-center">
                  <p class="fw-bold">${tweet.User.name}</p>
                  <p class="font-size-sm text-secondary">
                    @${tweet.User.account}・${tweet.createdAt}
                  </p>
                </a>
              </div>

              <form
                action="/admin/tweets/${tweet.id}?_method=DELETE"
                method="POST"
                style="display: inline">
                <button
                  type="submit"
                  class="btn admin-delete-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteTweetModal">
                  <img
                    src="/images/icons/close_outlined.svg"
                    alt=""
                    class="filter-grey-7" />
                </button>
              </form>
            </div>
            <p class="m-0">
              ${tweet.description}
            </p>
          </div>
        </div>
        <div class="bottom-border"></div>
      </div>
        `
      return html
    })
    container.innerHTML += moreTweets.join('')
    // Get delete button
    const deleteButtons = document.querySelectorAll('.admin-delete-btn')
    // Bind click event
    deleteButtons.forEach(button => {
      button.removeEventListener('click', removeTweet)
      button.addEventListener('click', removeTweet)
    })
  }
})

async function loadMoreTweets () {
  // 使用 AJAX 來從伺服器獲取更多資料
  try {
    tweetsPage += 1
    const response = await axios.get(`/admin/tweetsUnload?limit=${TWEETS_LIMIT}&page=${tweetsPage}`)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

function removeTweet (e) {
  e.preventDefault()
  // Get tweet id
  const tweetId = this.closest('.admin-tweet-card').dataset.id
  // console.log('tweetId', tweetId)

  // Fill delete form action
  const deleteForm = document.querySelector('#deleteTweetForm')
  deleteForm.action = `/admin/tweets/${tweetId}?_method=DELETE`

  // Get confirm delete button
  const confirmButton = document.querySelector(
    "#deleteTweetForm button[type='submit']"
  )

  const submitHandler = () => {
    deleteForm.submit()
  }
  confirmButton.removeEventListener('click', submitHandler)
  confirmButton.addEventListener('click', submitHandler)
}
