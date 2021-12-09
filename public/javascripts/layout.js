const body = document.querySelector('body')
const modal = document.querySelectorAll('.modal')
const modalReply = document.querySelector('#modal-reply')

const tweetsPostForm = document.querySelector('#tweets-post-form')
const tweetsPostFormTextarea = document.querySelector(
  '#tweets-post-form-textarea'
)
const modalPostForm = document.querySelector('#modal-post-form')
const modalPostFormTextarea = document.querySelector(
  '#modal-post-form-textarea'
)
const inputs = document.querySelectorAll('input,textarea')

// // 全畫面監聽器
body.addEventListener('click', async (event) => {
  const target = event.target

  if (target.classList.contains('close') || target.classList.contains('mask')) {
    // 點擊X icon關閉，另可點擊modal對話框以外地方關閉
    Array.from(modal).forEach((el) => {
      el.classList = 'modal d-none'
    })
  } else if (target.classList.contains('commenting')) {
    // 如果按下個別"回覆"icon，開啟 replying modal
    // axios here to get tweet info
    let tweetId = target.dataset.tweetid
    if (!tweetId) {
      tweetId = target.parentElement.dataset.tweetid
    }

    const response = await axios.get(
      `${window.location.origin}/api/tweets/${tweetId}`
    )
    const { tweet, loginUser } = response.data

    const modalHtml = `
    <div class="mask">
      <div class="dialog">
        <div class="dialog-header">
          <a class="close"><i class='X-orange close'></i></a>
        </div>
        <div class="replyarea">

          <div class="tweet">
            <a>
              <img class="thumbnail" src="${tweet.User.avatar}" alt="">
            </a>
            <div class="tweetcontent">
              <a class="tweetuser">
                <span class="name ellipsis">${tweet.User.name}</span>
                <span class="at-name ellipsis">${tweet.User.account}</span>
                <span class="timer ellipsis">${tweet.createdAt}</span>
              </a>
              <span class="tweetdescription">
              ${tweet.description}
              </span>
              <span class="replyto">回覆給
                <span class="at-name">@${tweet.User.account}</span>
              </span>
            </div>

          </div>
        </div>

        <div class="postarea">
          <a>
            <img class="thumbnail" src="${loginUser.avatar}" alt="">
          </a>
          <form action="/tweets/${tweet.id}/replies" method="post" id="modal-reply-form" novalidate>
            <input type="hidden" name="userId" value="${loginUser.id}">
            <textarea name="comment" maxlength="140" cols="48" rows="2" placeholder="推你的回覆"
              id="modal-reply-form-textarea" required></textarea>
            <div class="foot">
              <span class="d-none">內容不可空白</span>
              <button type="summit" class="btn-fill">回覆</button>
            </div>
          </form>
        </div>

      </div>
    </div>
    `
    modalReply.innerHTML = modalHtml

    modalReply.classList.remove('d-none')

    const modalReplyForm = document.querySelector('#modal-reply-form')
    const modalReplyFormTextarea = document.querySelector(
      '#modal-reply-form-textarea'
    )

    validityEmpty(modalReplyForm, modalReplyFormTextarea)
  } else if (target.classList.contains('back-arror')) {
    history.back()
  }
})

if (tweetsPostForm) {
  validityEmpty(tweetsPostForm, tweetsPostFormTextarea)
}

if (modalPostForm) {
  validityEmpty(modalPostForm, modalPostFormTextarea)
}

if (inputs) {
  inputs.forEach((el) => {
    el.addEventListener('focus', function onInputFocus (event) {
      el.parentElement.classList.add('focus')
    })
    el.addEventListener('blur', function onInputBlur (event) {
      el.parentElement.classList.remove('focus')
    })
    el.addEventListener('invalid', onInputInvalid)

    el.addEventListener('keyup', onInputKeyup)
  })
}

function isEmpty (nodeElement) {
  // 無文字回傳true，文字長度大於0，回傳false
  return !nodeElement.value.replace(/\s/g, '').length
}

function validityEmpty (form, inputarea) {
  // 驗證inputarea是否為空白
  form.addEventListener('submit', function onFormSubmitted (event) {
    if (!form.checkValidity() || isEmpty(inputarea)) {
      // 停止type=submit預設動作
      event.stopPropagation()
      event.preventDefault()
      //  驗證不通過，顯示alert message (移除d-none class)
      form.lastElementChild.firstElementChild.classList = ''
    }
  })

  inputarea.addEventListener('keyup', function onFormKeyup (event) {
    if (!isEmpty(inputarea)) {
      //  使用者開始輸入，隱藏alert message (加上d-none class)
      form.lastElementChild.firstElementChild.classList = 'd-none'
    }
  })
}

function onInputInvalid (event) {
  // submit 驗證客製功能
  const target = event.target

  if (target.validity.valueMissing) {
    if (target.name === 'account') {
      target.parentElement.setAttribute('err_msg', '帳號不存在！')
    } else {
      target.parentElement.setAttribute('err_msg', '內容不可為空白')
    }
  }

  if (target.validity.typeMismatch) {
    target.parentElement.setAttribute('err_msg', '格式錯誤')
  }

  if (target.validity.tooLong) {
    target.parentElement.setAttribute('err_msg', '字數超出上限！')
  }

  if (target.validity.tooShort) {
    target.parentElement.setAttribute('err_msg', '最少4個英文或數字組合！')
  }

  event.stopPropagation()
  event.preventDefault()
  target.parentElement.classList.add('invalid')
}

function onInputKeyup (event) {
  // 使用者開始輸入，取消invalid樣式
  const target = event.target
  target.parentElement.classList.remove('invalid')

  if (event.target.name === 'account') {
    // 避免非英文數字輸入account
    target.value = target.value.replace(/[\W]/g, '')
  }
}
