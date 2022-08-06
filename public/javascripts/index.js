const postPanel = document.querySelector('.table')
const replyPanel = document.querySelector('.reply-panel')
const postModal = document.querySelector('.post-modal')
const replyPost = document.querySelector('.reply-the-post')
const tweetModal = document.querySelector('.add-post')
const replyForm = document.querySelector('.reply-form')

// tweet-modal驗證
tweetModal.addEventListener('click', e => {
  const tweet = e.target.parentElement.parentElement.parentElement.children[2].value
  console.log(`回覆字數: ${tweet.length}`)
  if (tweet.length === 0) {
    document.getElementById('error').innerHTML = '內容不可空白'
    e.preventDefault()
  } else if (tweet.length > 140) {
    document.getElementById('error').innerHTML = '字數不可超過140字'
    e.preventDefault()
  }
})

// reply-modal驗證
replyPost.addEventListener('click', e => {
  const reply = e.target.parentElement.parentElement.children[0].children[2].value
  console.log(`回覆字數: ${reply.length}`)
  if (reply.length === 0) {
    document.getElementById('error-msg').innerHTML = '內容不可空白'
    e.preventDefault()
  } else if (reply.length > 140) {
    document.getElementById('error-msg').innerHTML = '字數不可超過140字'
    e.preventDefault()
  }
})

// 特定貼文詳情: /tweets
postPanel.addEventListener('click', e => {
  const post = e.target.parentElement.parentElement.parentElement.children[0]
  const tweetId = e.target.dataset.id
  const userName = post.children[0].textContent
  const userAccountTime = post.children[1].textContent
  const userAccount = userAccountTime.split('．')[0]
  const description = post.children[2].textContent
  const avatar = post.parentElement.parentElement.children[0].children[0].children[0].src

  const TweetInfo =
    `
    <div class="btn-group me-0">
      <div class="px-2 tweet">
        <div class="reply-modal-tweet-right column mb-2">
          <img src="${avatar}" alt="post-icon" style="border-radius: 50%; width: 50px; height: 50px;"></td>
          <a href="" class="user-name" style="margin-left: 6px;">${userName}</a><span class="user-account"
            style="color: #6C757D;">${userAccountTime}</span>
          <div class="reply-modal-tweet-text" style="margin-left: 60px;">${description}</div>
          <span style="color: #6C757D; margin-left: 60px;">回覆給 <span style="color: #FF6600;">${userAccount}</span></span>
        </div>
      </div>
      <div class="vertical-line"
        style="position: absolute; border-left: 2px solid #B5B5BE; height: 55px; left: 30px; top: 58px;"></div>
    </div>
      `

  postModal.innerHTML = TweetInfo
  replyForm.setAttribute('action', `/tweets/${tweetId}/replies`)
})

// 特定貼文詳情: /tweet
replyPanel.addEventListener('click', e => {
  const post = e.target.parentElement.parentElement.children[1]
  const tweetId = e.target.dataset.id
  const userName = post.children[0].textContent
  const userAccount = post.children[1].textContent
  const description = post.children[2].textContent

  const avatar = e.target.parentElement.parentElement.children[0].children[0].src

  const TweetInfo =
    `
    <div class="btn-group me-0">
      <div class="px-2 tweet">
        <div class="reply-modal-tweet-right column mb-2">
          <img src="${avatar}" alt="post-icon" style="border-radius: 50%; width: 50px; height: 50px;"></td>
          <a href="" class="user-name" style="margin-left: 6px;">${userName}</a><span class="user-account"
            style="color: #6C757D;">${userAccount}</span>
          <div class="reply-modal-tweet-text" style="margin-left: 60px;">${description}</div>
          <span style="color: #6C757D; margin-left: 60px;">回覆給 <span style="color: #FF6600;">${userAccount}</span></span>
        </div>
      </div>
      <div class="vertical-line"
        style="position: absolute; border-left: 2px solid #B5B5BE; height: 50px; left: 30px; top: 58px; z-index: 0;"></div>
    </div>
      `

  postModal.innerHTML = TweetInfo
  replyForm.setAttribute('action', `/tweets/${tweetId}/replies`)
})
