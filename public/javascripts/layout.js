const post = document.querySelector('#post')
const modalPost = document.querySelector('#modal-post')
const modalPostClose = document.querySelector('#modal-post-close')
const modalPostMask = document.querySelector('#modal-post-mask')

const commenting = document.querySelectorAll('.commenting')
const modalReply = document.querySelector('#modal-reply')
const modalReplyClose = document.querySelector('#modal-reply-close')
const modalReplyMask = document.querySelector('#modal-reply-mask')

// posting modal
post.addEventListener('click', (event) => modalPost.classList.remove('d-none'))
// 點擊X關閉
modalPostClose.addEventListener('click', (event) => modalPost.classList.add('d-none'))
// 除點擊X關閉外，另可點擊modal對話框以外地方關閉
modalPostMask.addEventListener('click', (event) => {
  if (event.target.classList.contains('mask')) {
    modalPost.classList.add('d-none')
  }
})

// replying modal
Array.from(commenting).map((el) => {
  el.addEventListener('click', (event) => {
    // axios here to get tweet info
    modalReply.classList.remove('d-none')
  })
})
// 點擊X關閉
modalReplyClose.addEventListener('click', (event) => modalReply.classList.add('d-none'))
// 除點擊X關閉外，另可點擊modal對話框以外地方關閉
modalReplyMask.addEventListener('click', (event) => {
  if (event.target.classList.contains('mask')) {
    modalReply.classList.add('d-none')
  }
})
