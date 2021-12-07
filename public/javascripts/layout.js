const body = document.querySelector('body')
const modal = document.querySelectorAll('.modal')
const modalReply = document.querySelector('#modal-reply')

// // 全畫面監聽器
body.addEventListener('click', (event) => {
  let target = event.target

  if (target.classList.contains('close') || target.classList.contains('mask')) {
    // 點擊X icon關閉，另可點擊modal對話框以外地方關閉
    Array.from(modal).map((el) => {
      el.classList = 'modal d-none'
    })
  } else if (target.classList.contains('commenting')) {
    // 如果按下個別"回覆"icon，開啟 replying modal
    // axios here to get tweet info
    modalReply.classList.remove('d-none')
  }
})

const tweetsPostForm = document.querySelector('#tweets-post-form')
const tweetsPostFormTextarea = document.querySelector('#tweets-post-form-textarea')
const modalPostForm = document.querySelector('#modal-post-form')
const modalPostFormTextarea = document.querySelector('#modal-post-form-textarea')
const modalReplyForm = document.querySelector('#modal-reply-form')
const modalReplyFormTextarea = document.querySelector('#modal-reply-form-textarea')
const inputs = document.querySelectorAll('input')

function isEmpty(nodeElement) {
  // 無文字回傳true，文字長度大於0，回傳false
  return nodeElement.value.replace(/\s/g, '').length ? false : true
}

function validityEmpty(form, inputarea) {
  // 驗證inputarea是否為空白
  form.addEventListener('submit', function onFormSubmitted(event) {
    if (!form.checkValidity() || isEmpty(inputarea)) {
      // 停止type=submit預設動作
      event.stopPropagation()
      event.preventDefault()
      //驗證不通過，顯示alert message (移除d-none class)
      form.lastElementChild.firstElementChild.classList = ''
    }
  })

  inputarea.addEventListener('keyup', function onFormKeyup(event) {
    if (!isEmpty(inputarea)) {
      //使用者開始輸入，隱藏alert message (加上d-none class)
      form.lastElementChild.firstElementChild.classList = 'd-none'
    }
  })
}

if (tweetsPostForm) {
  validityEmpty(tweetsPostForm, tweetsPostFormTextarea)
}

if (modalPostForm) {
  validityEmpty(modalPostForm, modalPostFormTextarea)
}

if (modalReplyForm) {
  validityEmpty(modalReplyForm, modalReplyFormTextarea)
}

if (inputs) {
  inputs.forEach((el) => {
    el.addEventListener('focus', function onInputFocus(event) {
      el.parentElement.classList.add('focus')
    })
    el.addEventListener('blur', function onInputBlur(event) {
      el.parentElement.classList.remove('focus')
    })
    el.addEventListener('invalid', function onInputInvalid(event) {
      if (el.validity.valueMissing) {
        if (el.name === 'account') {
          el.parentElement.setAttribute('err_msg', '帳號不存在！')
        } else {
          el.parentElement.setAttribute('err_msg', '內容不可為空白')
        }
      }

      if (el.validity.typeMismatch) {
        el.parentElement.setAttribute('err_msg', '格式錯誤')
      }

      if (el.validity.rangeOverflow) {
        el.parentElement.setAttribute('err_msg', '字數超出上限！')
      }

      event.stopPropagation()
      event.preventDefault()
      el.parentElement.classList.add('invalid')
    })
  });
}
