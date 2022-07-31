const panel = document.querySelector('#tweets-panel')

panel.addEventListener('click', event => {
  const tweet = event.target

  // 找出回頭塞資料的部分
  const originUserAvatar = document.querySelector('#modal-origin-user-avatar')
  const originTweetInformation = document.querySelector('#modal-origin-tweet-information')
  const replyAccount = document.querySelector('#modal-reply-account')
  const loginUserAvatar = document.querySelector('#login-user-avatar')
  const replyFormDiv = document.querySelector('#modal-reply-form-div')

  // 塞資料
  originUserAvatar.innerHTML = `
    <div class="rounded-circle" style="height: 50px; width: 50px; background: url('${tweet.dataset.useravatar}'); background-size: cover; background-position: center;"></div>
    <div class="mx-auto mt-1" style="border: 1px solid #B5B5BE; flex-grow: 1">
    </div>
  `

  originTweetInformation.innerHTML = `
    <a style="text-decoration: none; color: #171725" href="/users/${tweet.dataset.userid}">
      <span style="font-size: 16px">
        <b>${tweet.dataset.username}</b>
      </span>
    </a>

    <span style="font-size: 14px; padding-left: 8px">@${tweet.dataset.useraccount}・</span>

    <a style="text-decoration: none; color: #6C757D" href="/tweets/${tweet.dataset.tweetid}/replies">
      <span style="font-size: 14px">${tweet.dataset.tweetcreate}</span>
    </a>

    <p class="mt-2">${tweet.dataset.tweetdescription}</p>
  `

  replyAccount.innerHTML = `
    回覆給&nbsp;&nbsp;<a href="/users/${tweet.dataset.userid}" class="brand-color">@${tweet.dataset.useraccount}</a>
  `

  loginUserAvatar.innerHTML = `
    <div class="rounded-circle" style="height: 50px; width: 50px; background: url('${tweet.dataset.loginuseravatar}'); background-size: cover; background-position: center;"></div>
  `

  replyFormDiv.innerHTML = `
    <form id="modal-reply-form" action="/tweets/${tweet.dataset.tweetid}/replies" method="POST" class="needs-validation" novalidate>
      <textarea class="border border-0 form-control p-0 mb-2" name="comment" placeholder="推你的回覆" maxlength="141" rows="5" required id="modal-reply-textarea"></textarea>

      <span class="text-danger me-1" style="font-size: 15px; font-weight:500;" id="validate-empty" >內容不可空白</span>

      <span class="text-danger me-1 display-none" style="font-size: 15px; font-weight:500;" id="validate-over">字數不可超過140 字</span>

      <button type="submit" class="btn btn-brand radius50 ms-3">回覆</button>
    </form>
    `

  const modalReplyTextarea = document.querySelector('#modal-reply-textarea')
  const validateEmpty = document.querySelector('#validate-empty')
  const validateOver = document.querySelector('#validate-over')

  modalReplyTextarea.addEventListener('input', event => {
    if (modalReplyTextarea.value.length > 0) {
      validateEmpty.classList.add('display-none')
    }
    if (modalReplyTextarea.value.length <= 0) {
      validateEmpty.classList.remove('display-none')
    }
    if (modalReplyTextarea.value.length > 140) {
      validateOver.classList.remove('display-none')
    }
    if (modalReplyTextarea.value.length <= 140) {
      validateOver.classList.add('display-none')
    }
  })

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')
  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }
      form.classList.add('was-validated')
    }, false)
  })
})
