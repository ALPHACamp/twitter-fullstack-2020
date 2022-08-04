const postPanel = document.querySelector('.table')
const postModal = document.querySelector('.post-modal')
const tweetModal = document.querySelector('.modal-body')

// 特定貼文詳情
postPanel.addEventListener('click', e => {
  // 取得貼文資料
  const post = e.target.parentElement.parentElement.parentElement.children[0]
  const tweetId = e.target.dataset.id
  const userName = post.children[0].textContent
  const userAccount = post.children[1].textContent
  const description = post.children[2].textContent

  const TweetInfo =
    `
    <form action="/tweets/${tweetId}/replies" method="POST">
      <div class="btn-group me-0">
        <div class="px-2 tweet">
          <div class="reply-modal-tweet-right column mb-2">
            <img src="https://upload.cc/i1/2022/07/29/CW8Hu0.png" alt="post-icon" class="post-icon"></td>
            <a href="" class="user-name">${userName}  </a><span class="user-account">${userAccount}</span>
        <div class="reply-modal-tweet-text m-2">${description}</div>
         <span >回覆給${userAccount}</span>
        <div class= "d-flex m-3"><img src="{{user.avatar}}" alt="avatar">
            <label for="reply" class="form-label"></label>
            <input name="reply" id="modal-reply" class="tweetTextarea" placeholder="推你的回覆" style="border:none;"></input>
        </div>
        </div>
         <div id ="error-msg" class="text-alert inline" role="alert"></div>
        <h4>
          <button type="submit" class="badge rounded-pill text-bg-warning tweet-button" id ="tweet-button">回覆</button>
        </h4>
        </div>
      </div>
    </form>
      `

  postModal.innerHTML = TweetInfo
})

// reply-modal驗證
postModal.addEventListener('submit', e => {
  const reply = e.target.children[0].children[0].children[0].children[5].children[2].value
  console.log(`回覆字數: ${reply.length}`)
  if (reply.length === 0) {
    document.getElementById('error-msg').innerHTML = '內容不可空白'
    e.preventDefault()
  } else if (reply.length > 140) {
    document.getElementById('error-msg').innerHTML = '限制140字數'
    e.preventDefault()
  }
})

// tweet-modal驗證
tweetModal.addEventListener('submit', e => {
  const tweet = e.target.children[1].value
  console.log(`回覆字數: ${tweet.length}`)
  console.log(tweet)
  if (tweet.length === 0) {
    document.getElementById('error').innerHTML = '內容不可空白'
    e.preventDefault()
  } else if (tweet.length > 140) {
    document.getElementById('error').innerHTML = '限制140字數'
    e.preventDefault()
  }
})
