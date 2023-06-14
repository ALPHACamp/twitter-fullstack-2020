const replyBtns = document.querySelectorAll('.reply-btn')
const replyModal = document.querySelector('#replyModal')

replyBtns.forEach(btn => {
  btn.addEventListener('click', e => {
    const btn = e.target.classList.contains('reply-btn')
      ? e.target
      : e.target.parentElement
    const { account, id, img, time, name, description, userAvatar } =
      btn.dataset

    replyModal.innerHTML = `<div class="modal-dialog">
    <div class="modal-content" style="width:634px;height:500px;border-radius:14px;padding:0px 16px">
    <div class=" d-flex justify-content-start m-2">
      <button type="button" class="btn-close " data-bs-dismiss="modal" aria-label="Close" style="color: #FF6600;">
      </button>
    </div>
    <hr class="solid">
    <form action="/tweets/${id}/replies" method="POST">  
      <div class="d-flex flex-column">
        <div class="d-flex flex-row mb-3" >
          <div>
            <img src="${img}" width="50px" ;height="50px" style="display:inline-block;border-radius:100%;border:2px black solid;margin:auto 8px auto 24px" alt="avatar"> 
          </div>
          <div class="d-flex flex-column">
            <div class="d-flex justify-content-start m-2">
              <p class="name mb-0" style="font-size:15px">${name}@</p>
              <p class="account mb-0" style="font-size:15px">${account}</p>
              <p class="time mb-0" style="font-size:15px">${time}</p>
            </div>
            <p class="content mt-0 pt-0">${description} </p>
            <p class="reply-to"> 回覆給@${account}</p>
          </div>  
        </div>
        <div class="form-row d-flex flex-row mb-3" style="display:inline-block">
          <div>
            <img src="${userAvatar}" width="50px" ;height="50px" style="display:inline-block;border-radius:100%;border:2px black solid;margin:auto 8px auto 24px" alt="avatar"> 
          </div>
          <textarea class="form-control" id="comment" style="border:none;padding:0px;resize: none" name="comment" rows="7" cols="20" maxlength="140" minlength="1"  placeholder="推你的回覆"></textarea>
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
