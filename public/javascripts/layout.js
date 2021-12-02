const post = document.querySelector('#post')
const modalPost = document.querySelector('#modal-post')
const modalPostClose = document.querySelector('#modal-post-close')
const modalPostMask = document.querySelector('#modal-post-mask')
const modalPostDialog = document.querySelector('#modal-post-dialog')

post.addEventListener('click', (event) => modalPost.classList.remove('d-none'))
modalPostClose.addEventListener('click', (event) => modalPost.classList.add('d-none'))
modalPostMask.addEventListener('click', (event) => {
  if (event.target.classList.contains('mask')) {
    modalPost.classList.add('d-none')
  }
})