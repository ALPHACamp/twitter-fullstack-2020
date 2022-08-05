const postPanel = document.querySelector('.table')
const replyPanel = document.querySelector('.reply-panel')
const postModal = document.querySelector('.post-modal')
const tweetModal = document.querySelector('.modal-body')
const replyForm = document.querySelector('.reply-form')

// 特定貼文詳情: /tweets
postPanel.addEventListener('click', e => {
  const post = e.target.parentElement.parentElement.parentElement.children[0]
  const tweetId = e.target.dataset.id
  const userName = post.children[0].textContent
  const userAccount = post.children[1].textContent
  const description = post.children[2].textContent
  const avatar = post.parentElement.parentElement.children[0].children[0].children[0].src

  const TweetInfo =
    `
    <div class="btn-group me-0">
      <div class="px-2 tweet">
        <div class="reply-modal-tweet-right column mb-2">
          <img src="${avatar}" alt="post-icon" class="post-icon"></td>
          <a href="" class="user-name">${userName} </a><span class="user-account">${userAccount}</span>
          <div class="reply-modal-tweet-text m-2">${description}</div>
          <span>回覆給${userAccount}</span>
        </div>
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
          <img src="${avatar}" alt="post-icon" class="post-icon"></td>
          <a href="" class="user-name">${userName} </a><span class="user-account">${userAccount}</span>
          <div class="reply-modal-tweet-text m-2">${description}</div>
          <span>回覆給${userAccount}</span>
        </div>
      </div>
    </div>
    `

  postModal.innerHTML = TweetInfo
  replyForm.setAttribute('action', `/tweets/${tweetId}/replies`)
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
