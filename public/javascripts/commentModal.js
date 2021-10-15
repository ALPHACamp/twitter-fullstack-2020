const tweets = document.querySelector('.tweets')
const main = document.querySelector('.main')
const body = document.querySelector('body')
const comment = document.querySelector('.comment-page-icon')
const userEditBTN = document.querySelector('.user-edit-btn')

if (tweets) {
  tweets.addEventListener('click', event => {
    const target = event.target
    const { tweetid, avatar, name, accountname, createtime, tweetcontent, useravatar } = getData(target)
    const modal = document.createElement("div")
    modal.classList = 'modalContainerTweet'
    modal.innerHTML = buildHTMLTweet(tweetid, avatar, name, accountname, createtime, tweetcontent, useravatar)
    body.insertBefore(modal, main)
    setTimeout(removeModalTweet(), 500)
  })
}

if (comment) {
  comment.addEventListener('click', event => {
    const target = event.target
    const { tweetid, avatar, name, accountname, createtime, tweetcontent, useravatar } = getData(target)
    const modal = document.createElement("div")
    modal.classList = 'modalContainerTweet'
    modal.innerHTML = buildHTMLTweet(tweetid, avatar, name, accountname, createtime, tweetcontent, useravatar)
    body.insertBefore(modal, main)
    setTimeout(removeModalTweet(), 500)
  })
}

if (userEditBTN) {
  userEditBTN.addEventListener('click', event => {
    const target = event.target
    const { userid, username, usercover, useravatar, userintroduction } = target.dataset
    const modalEdit = document.createElement("div")
    modalEdit.classList = 'modal-edit-user'
    modalEdit.innerHTML = buildHTMLEdit(userid, username, usercover, useravatar, userintroduction)
    body.insertBefore(modalEdit, main)
    const modalClose = document.querySelector('.close-edit')

    const modalUsernameInput = document.querySelector('.modal-username-input')
    const modalIntroductionInput = document.querySelector('.self-introduction')
    const modalNameCount = document.querySelector('.edit-modal-user-name')
    const modalIntroductionCount = document.querySelector('.edit-modal-user-introduction')

    let nameLength = modalUsernameInput.value.length
    let introductionLength = modalIntroductionInput.value.length

    modalUsernameInput.addEventListener('keyup', event => {
      if (event.keyCode === 8 || event.keyCode === 46){
        if (nameLength >0) {
          modalNameCount.innerHTML = nameLength -= 1
        } else {
          modalNameCount.innerHTML = 0
        }
      } else {
        modalNameCount.innerHTML = nameLength += 1
      }
    })

    modalIntroductionInput.addEventListener('keyup', event => {
      if (event.keyCode === 8 || event.keyCode === 46) {
        if (introductionLength > 0) {
          modalIntroductionCount.innerHTML = introductionLength -= 1
        } else {
          modalIntroductionCount.innerHTML = 0
        }
      } else {
        modalIntroductionCount.innerHTML = introductionLength += 1
      }
    })
    
    modalClose.addEventListener('click', event => {
      modalEdit.remove()
    })
    userEditBTN.addEventListener('submit', event => {
      modalEdit.remove()
    })
  })
}

function getData (target) {
  if (target.className.includes('comment-icon')) {
    const parent = target.parentElement
    tweetid = parent.dataset.tweetid
    avatar = parent.dataset.avatar
    name = parent.dataset.name
    accountname = parent.dataset.accountname
    createtime = parent.dataset.createtime
    tweetcontent = parent.dataset.tweetcontent
    useravatar = parent.dataset.useravatar
  } else if (target.className.includes('goto-comment')) {
    tweetid = target.dataset.tweetid
    avatar = target.dataset.avatar
    name = target.dataset.name
    accountname = target.dataset.accountname
    createtime = target.dataset.createtime
    tweetcontent = target.dataset.tweetcontent
    useravatar = target.dataset.useravatar
  }
  return { tweetid, avatar, name, accountname, createtime, tweetcontent, useravatar }
}

function buildHTMLTweet(tweetid, avatar, name, accountname, createtime, tweetcontent, useravatar) {
  return (
    `
    <div class="comment-modalBox">
      <div class="modal-close">
        <button type="button" class="modal-close-btn"><i class="fas fa-times modal-close-btn"></i></button>
      </div>
      <div class="modal-twitter-box">
        <div class="twitter-img">
          <img src="${avatar}" alt="" class="tweets-img">
          <div class="twitter-line"></div>
        </div>
        <div class="modal-upper-region">
          <div class="twitter-info modal-twitter-info">
            <span>${name}</span>
            <span class="twitter-account">${accountname}</span>
            <span class="twitter-dot">。</span>
            <span class="twitter-createdAt">${createtime}</span>
          </div>
          <div class="modal-tweet-content">${tweetcontent}</div>
          <span class="bottom-note">回覆給</span><span class="buttom-note-account">${accountname}</span>
        </div>
      </div>
      <form action="/tweets/${tweetid}/replies" method="post" class="modal-input">
        <div class="modal-input-upper">
          <img src="${useravatar}" alt="" class="tweets-img">
          <textarea type="text" name="comment" maxlength="140" placeholder="推你的回覆"></textarea>
        </div>
        <button type="submit" class="modal-reply-btn">回覆</button>
      </form>
    </div>
    `
  )
}

function removeModalTweet() {
  const modal = document.querySelector('.modalContainerTweet')
  modal.addEventListener('click', event => {
    const target = event.target
    if (target.classList.contains('modal-close-btn')) {
      modal.remove()
    }
  })
}

function buildHTMLEdit(userid, username, usercover, useravatar, userintroduction) {
  const nameLength = username.length
  return (
  `
  <form action="/users/${userid}?_method=PUT" method="post" class="modal-edit-box" enctype="multipart/form-data">
    <div class="modal-edit-title-box">
      <div>
        <button type="button" class="close-edit"><i class="fas fa-times modal-close-btn"></i></button>
        <span class="modal-edit-title">編輯個人資料</span>
      </div>
      <div>
        <button type="submit" class="modal-edit-submit">儲存</button>
      </div>
    </div>
    <div class="modal-edit-cover">
      <img src="${usercover}" alt="" srcset="">
      <input type="file" name="cover" id="edit-cover">
    </div>
    <div class="modal-edit-avatar">
      <img src="${useravatar}" alt="" srcset="">
      <input type="file" name="avatar" id="edit-avatar">
    </div>
    <div class="edit-account">
      <span>名稱</span>
      <input type="text" name="account" value="${username}" maxlength="50" class="modal-username-input">
      <div class="modal-edit-name">
        <span class="edit-modal-user-name">${nameLength}</span>
        <span>/50</span>
      </div>
    </div>
    <div class="edit-description">
      <textarea type="text" name="introduction" value=${userintroduction} maxlength="160" class="self-introduction" placeholder="自我介紹"></textarea>
      <div class="modal-edit-name">
      <span class="edit-modal-user-introduction"></span>
      <span>/160</span>
      </div>
    </div>
  </form>
  `
  )
}