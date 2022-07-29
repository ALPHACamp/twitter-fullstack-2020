// const replyBtns = document.querySelectorAll('.reply-btn')
// let userAvatar = document.querySelector('#model-user-avatar')
// let userName = document.querySelector('#model-user-name')
// let userAccount = document.querySelector('#model-user-account')
// let tweetContent = document.querySelector('#model-description')
// let tweetTime = document.querySelector('#model-time')
// let tweetInput = document.querySelector('#tweet-input')

// function replyBtnOnClick(target) {
//   if (target.matches('.reply-btn')) {
//     const tweetId = target.dataset.tweetid
//     const userId = target.dataset.userid
//     const avatar = document.querySelector(`#tweet-avatar-${userId}`).src
//     const name = document.querySelector(`#tweet-name-${userId}`).innerText
//     const account = document.querySelector(`#tweet-account-${userId}`).innerText
//     const time = document.querySelector(`#tweet-time-${tweetId}`).innerText
//     const tweetUserAccount = document.querySelector(`#tweet-account-${userId}`).innerText
//     const description = document.querySelector(`#description-${tweetId}`).innerText
//     userAvatar.src = avatar
//     userName.innerText = name
//     userAccount.innerHTML = account
//     tweetTime.innerHTML = time
//     const rawHTML = `<span class="fs-7 text-black-50">回覆給</span> <span class="text-brand fs-7">${tweetUserAccount}</span>`
//     tweetContent.innerText = description + '\n'
//     tweetContent.innerHTML += rawHTML
//     tweetInput.innerHTML = `<form action="/tweets/${{tweetId}}/replies" method="POST">
//             <div class="d-flex flex-wrap mt-3 ms-1">
//               <div class="me-1">
//                 <img src="{{currentUser.avatar}}" alt="" class="avatar-sm rounded-pill">
//               </div>
//               <textarea class="window-description-input w-auto border border-0 ms-1 mb-1" name="comment"
//                 id="comment" cols="65" rows="8" placeholder="有什麼新鮮事？"></textarea>
//             </div>
//             <div class="modal-footer border border-0">
//               <button type="submit" class="send-button btn btn-brand rounded-pill px-3 ms-auto mb-3 me-3">回覆</button>
//             </div>
//           </form>`
//   }
// }

// replyBtns.forEach(btn => {
//   btn.addEventListener('click', event => {
//     replyBtnOnClick(event.target)
//   })
// })
