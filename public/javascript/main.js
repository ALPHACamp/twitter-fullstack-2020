const body = document.querySelector('.container-fluid')
const re = new RegExp("^[ ]+$")

body.addEventListener('input', (e) => {
  const tweetButton = e.target.nextElementSibling.firstElementChild
  const tweetError = e.target.nextElementSibling.lastElementChild
  let isSpace = re.test(e.target.value)
  if (isSpace) {
    tweetError.style.display = 'inline'
    tweetButton.style.display = 'none'
  } else if (e.target.value) {
    tweetError.style.display = 'none'
    tweetButton.style.display = 'inline'
  } else {
    tweetError.style.display = 'inline'
    tweetButton.style.display = 'none'
  }
})

//將放在前端藏起來的資訊，放到partial的回覆modal
const replyModal = document.querySelector('.reply-modal-tweet-right')
const replyForm = document.querySelector('.reply-modal-form')

body.addEventListener('click', (e) => {
  if (e.target.classList.contains('reply-modal-open')) {
    let tweetUserName = e.target.nextElementSibling.children[0].textContent
    let tweetUserAccount = e.target.nextElementSibling.children[1].textContent
    let tweetDescription = e.target.nextElementSibling.children[2].textContent
    let tweetId = e.target.nextElementSibling.children[3].textContent
    let tweetCreatedAt = e.target.nextElementSibling.children[4].textContent

    let TweetInfo =
      `
              <a href="" class="user-name">${tweetUserName}</a><span class="user-account">${tweetUserAccount} ${tweetCreatedAt}}</span>
              <div>
                <p class="pt-1">${tweetDescription}</p>
              </div>
              <span class="replyto-span">回覆給</span> 
              <span class="user-account-color-span">${tweetUserAccount}</span>
            </div>
        `
    replyModal.innerHTML = TweetInfo
    replyForm.setAttribute('action', `/tweets/${tweetId}/replies`)
    setTimeout(function () {
      $('#replyModal').modal('toggle')   //因為會延遲而顯示成上一個按的tweet，所以加上這個
    }, 0);
  }
  if (e.target.parentElement.classList.contains('reply-modal-open')) {
    let tweetUserName = e.target.parentElement.nextElementSibling.children[0].textContent
    let tweetUserAccount = e.target.parentElement.nextElementSibling.children[1].textContent
    let tweetDescription = e.target.parentElement.nextElementSibling.children[2].textContent
    let tweetId = e.target.parentElement.nextElementSibling.children[3].textContent
    let tweetCreatedAt = e.target.parentElement.nextElementSibling.children[4].textContent
    let TweetInfo =
      `
              <a href="" class="user-name">${tweetUserName}</a><span class="user-account">${tweetUserAccount} ${tweetCreatedAt}}</span>
              <div>
                <p class="pt-1">${tweetDescription}</p>
              </div>
              <span class="replyto-span">回覆給</span> 
              <span class="user-account-color-span">${tweetUserAccount}</span>
            </div>
        `
    replyModal.innerHTML = TweetInfo
    replyForm.setAttribute('action', `/tweets/${tweetId}/replies`)
    setTimeout(function () {
      $('#replyModal').modal('toggle')   //因為會延遲而顯示成上一個按的tweet，所以加上這個
    }, 0);
  }
})