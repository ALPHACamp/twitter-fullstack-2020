const main = document.querySelector('.container-fluid')
const replyModal = document.querySelector('.reply-modal-tweet')
// const replyOn = document.querySelector('#reply-on')

main.addEventListener('click', (event) => {
  if (event.target.classList.contains('reply-on')) {
    console.log(event.target)
  }
})