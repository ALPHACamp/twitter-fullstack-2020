const replyBtns = document.querySelectorAll('.reply-btn')
const replyModal = document.querySelector('#replyModal')

replyBtns.forEach(btn => {
  btn.addEventListener('click', e => {
    const btn = e.target.classList.contains('reply-btn')
      ? e.target
      : e.target.parentElement
    const { id, account, img, time, name, description, userAvatar } =
      btn.dataset
    console.log(btn.dataset)
    replyModal.innerHTML = `<div class="modal-dialog">
    <div class="modal-content" style="width:634px;border-radius:14px;">
    <div class=" d-flex justify-content-start modal-head"">
      <button type="button" class="reply-modal-xmark " data-bs-dismiss="modal" aria-label="Close">X
      </button>
    </div>
    <form action="/tweets/${id}/replies" method="POST">  
      <div class="d-flex flex-column" style="padding:0px 16px">
        <div class="d-flex flex-row mb-3" >
          <div>
            <img src="${img}" width="50px" ;height="50px" style="display:inline-block;border-radius:100%;margin:auto 8px auto 24px" alt="avatar"> 
          </div>
          <div class="d-flex flex-column reply-modal">
            <div class="d-flex justify-content-start">
              <p class="name" style="font-size:15px">${name}</p>
              <p class="account" style="font-size:15px; margin-top:0px;">@${account}</p>
              <p class="time" style="font-size:15px; margin-top:0px;">${time}</p>
            </div>
            <p class="content mt-0 pt-0">${description} </p>
            <div class="reply-to d-flex" style="color: #6C757D;">回覆給
              <p class="ms-1" style="color: #FF6600;">@${account}</p>
            </div>
          </div>  
        </div>
        <div class="form-row d-flex flex-row mb-3" style="display:inline-block">
          <div>
            <img src="${userAvatar}" width="50px" ;height="50px" style="display:inline-block;border-radius:100%;margin:auto 8px auto 24px" alt="avatar"> 
          </div>
          <textarea class="form-control" id="comment" style="border:none;padding:0px;resize: none;outline:none;box-shadow: none;border: #E6ECF0" name="comment" rows="7" cols="20" maxlength="140" minlength="1"  placeholder="推你的回覆"></textarea>
        </div>
      </div>
      <div class="d-flex justify-content-end" >
        <p class="warnig-meg" style="font-size:15px;color:#FC5A5A;margin:0;display: flex;align-items: center">內容不可空白</p>
        <input class="form-control" type="hidden" name="tweetId" value="${id}" />
        <button type="submit" class="btn btn-primary m-1" style="color:#FFFFFF;width:64px;height:40px;border:none;background:#FF6600;border-radius:50px">推文</button>
      </div> 
    </form>   
    </div>
  </div>`
  })
})
