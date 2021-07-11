const BASE_URL = 'http://localhost:8000'
const INDEX_URL = BASE_URL + '/api/tweets/'

const switchModal = document.querySelectorAll('.switch-modal')

function showReplyModal(id) {
  const replyUserName = document.querySelector('#modal-reply-user-name')
  const replyUserAccountAndTime = document.querySelector('#modal-reply-user-accountAndTime')
  const replyUserAvatar = document.querySelector('#modal-reply-user-avatar')
  const replyDescription = document.querySelector('#modal-reply-description')
  const replyTo = document.querySelector('#modal-reply-to')
  const replyForm = document.querySelector('#modal-reply-form')
  const replierAvatar = document.querySelector('#modal-replier-avatar')

  axios.get(INDEX_URL + id)
    .then(res => {
      const { User, createdAt, description, id } = res.data.tweet
      const userAvatart = User.avatar || 'https://i.imgur.com/3P9xRqb.jpg'
      replyUserName.innerText = User.name
      replyUserAccountAndTime.innerText = User.account + '·' + createdAt
      replyUserAvatar.innerHTML = `<img src="${userAvatart}" alt="" style="max-width: 50px; border-radius: 50%">`
      replyForm.setAttribute('action', `/tweets/${id}/replies`)
      replyDescription.innerText = description
      replyTo.innerText = User.name
    })
}



switchModal.forEach(tweet => {
  tweet.addEventListener('click', function onSwitchModalClicked(event) {
    showReplyModal(Number(event.target.dataset.id))
  })
})
