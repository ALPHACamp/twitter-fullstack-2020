const replyModal = document.getElementById('replyModal')
replyModal.addEventListener('show.bs.modal', function (event) {
  // Button that triggered the modal
  const button = event.relatedTarget
  // Extract info from data-bs-* attributes
  const tweet = button.getAttribute('data-bs-tweet')
  const avatarSrc = button.getAttribute('data-bs-tweeter-avatar')
  // If necessary, you could initiate an AJAX request here
  // and then do the updating in a callback.
  //
  // Update the modal's content.

  const tweeterAvatar = replyModal.querySelector('.modal-body img')
  const tweetContent = replyModal.getElementById('tweetContent')

  tweetContent.textContent = tweet

  tweeterAvatar.src = avatarSrc
})
