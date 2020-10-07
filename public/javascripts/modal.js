const main = document.querySelector('.container-fluid')
const replyModal = document.querySelector('.reply-modal-tweet')
const replyForm = document.querySelector('#reply-form')

main.addEventListener('click', (event) => {
  if (event.target.classList.contains('reply-on')) {
    console.log('yes')
    let replyUser = event.target.previousElementSibling.children[0].textContent
    let replyName = event.target.previousElementSibling.children[1].textContent
    let replyAccount = event.target.previousElementSibling.children[2].textContent
    let replyTime = event.target.previousElementSibling.children[3].textContent
    let replyDes = event.target.previousElementSibling.children[4].textContent
    let replyAvatar = event.target.previousElementSibling.children[5].textContent
    let replyTweet = event.target.previousElementSibling.children[6].textContent
    replyForm.setAttribute("action", `/tweets/${replyTweet}/replies`)

    let replyTemplate = `
    <div class="reply-modal-userPic">
      <img src="${replyAvatar}" class="rounded-circle" style="width: 50px;height:50px;">
    </div>
    <div class="reply-modal-info">
      <div class="reply-modal-name">
        <a href="/users/${replyUser}">
        ${replyName}
        </a>
        <span class="reply-time">@${replyAccount} · ${replyTime}</span>
      </div>
      <p>${replyDes}</p>
      <div class="reply-target">
        <span class="reply-mark">回覆給</span>
        <a class="reply-user" href="/users/${replyUser}">@${replyAccount}</a>
     </div>`
    replyModal.innerHTML = replyTemplate
    $("#replyModal").modal('show')
  }

  if (event.target.classList.contains('replies-on')) {
    let replyUser = event.target.previousElementSibling.children[0].textContent
    let replyName = event.target.previousElementSibling.children[1].textContent
    let replyAccount = event.target.previousElementSibling.children[2].textContent
    let replyTime = event.target.previousElementSibling.children[3].textContent
    let replyDes = event.target.previousElementSibling.children[4].textContent
    let replyAvatar = event.target.previousElementSibling.children[5].textContent
    let replyTweet = event.target.previousElementSibling.children[6].textContent
    let replyId = event.target.previousElementSibling.children[7].textContent
    replyForm.setAttribute("action", `/tweets/${replyTweet}/replies/${replyId}`)

    let replyTemplate = `
    <div class="reply-modal-userPic">
      <img src="${replyAvatar}" class="rounded-circle" style="width: 50px;height:50px;">
    </div>
    <div class="reply-modal-info">
      <div class="reply-modal-name">
        <a href="/users/${replyUser}">
        ${replyName}
        </a>
        <span class="reply-time">@${replyAccount} · ${replyTime}</span>
      </div>
      <p>${replyDes}</p>
      <div class="reply-target">
        <span class="reply-mark">回覆給</span>
        <a class="reply-user" href="/users/${replyUser}">@${replyAccount}</a>
     </div>`

    replyModal.innerHTML = replyTemplate
    $("#replyModal").modal('show')
  }
})

