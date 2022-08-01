const postPanel = document.querySelector('.table')
const postModal = document.querySelector('.post-modal')

// console.log(postPanel)

// 特定貼文詳情
postPanel.addEventListener('click', e => {
  // 取得貼文資料
  const post = e.target.parentElement.parentElement.parentElement.children[0]
  const tweetId = e.target.dataset.id
  const userName = post.children[0].textContent
  const userAccount = post.children[1].textContent
  const description = post.children[2].textContent

  console.log(tweetId)
  console.log(userName)
  console.log(userAccount)
  console.log(post.children[2].textContent)

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
        <h4>
          <button type="submit" class="badge rounded-pill text-bg-warning tweet-button">回覆</button>
        </h4>
        </div>
      </div>
    </form>
      `

  postModal.innerHTML = TweetInfo
})

// if (e.target.matches('.btn-show-reply')) {
//   console.log(e.target.dataset.id)
// }

// wrapper.addEventListener('click', e => {()}
// const tweet = document.getElementById('modal-description').value

// document.getElementById('error').innerHTML = '請輸入推文內容!'
// document.getElementById('error').innerHTML = '內容不可空白'
