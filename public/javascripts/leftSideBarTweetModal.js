const leftBar = document.querySelector('.left-bar')
const leftSpans = document.querySelectorAll('.left-side-span')



if (leftBar) {
  leftBar.addEventListener('click', event => {
    const target = event.target
    let useravatar = ''
    if (target.classList.contains('publish-tweet')) {
      useravatar = target.dataset.avatar
    } else {
      return
    }

    const modalLeft = document.createElement("div")
    modalLeft.classList = 'modalContainerLeft'
    modalLeft.innerHTML = buildHTML(useravatar)
    body.insertBefore(modalLeft, main)
    setTimeout(removeModalLeft(), 500)
  })
}

function buildHTML(useravatar) {
  return (
    `
    <div class="comment-modalBox-left">
      <div class="modal-close-left">
        <button type="button" class="modal-close-btn-left"><i class="fas fa-times modal-close-btn-left"></i></button>
      </div>
      <form action="/tweets" method="post" class="modal-input-left">
        <div class="modal-input-upper-left">
          <img src="${useravatar}" alt="" class="tweets-img">
          <textarea type="text" name="description" maxlength="140" placeholder="推你的回覆"></textarea>
        </div>
        <button type="submit" class="modal-tweet-btn">回覆</button>
      </form>
    </div>
    `
  )
}

function removeModalLeft() {
  const modalLeft = document.querySelector('.modalContainerLeft')
  modalLeft.addEventListener('click', event => {
    const target = event.target
    if (target.classList.contains('modal-close-btn-left')) {
      modalLeft.remove()
    }
  })
}