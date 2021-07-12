const BASE_URL = 'http://localhost:8000'
const INDEX_URL = BASE_URL + '/api/tweets/'

const switchModal = document.querySelectorAll('.switch-modal')

function showReplyModal(DOM, id) {
  const nameAndTimeAndDescription = document.querySelector('#nameAndTimeAndDescription')
  const applicantAvatar = document.querySelector('#modal-reply-user-avatar')
  const replyTo = document.querySelector('#modal-reply-to')
  const formGroup = document.querySelector('#modal-reply-form')

  const nameAndTimeAndDescriptionInnerHTML = DOM.previousElementSibling.innerHTML;
  const applicantAvatarInnerHTML = DOM.parentElement.previousElementSibling.innerHTML;
  let replyToInnerHTML = '回覆給 ';
  replyToInnerHTML += DOM.previousElementSibling.firstElementChild.firstElementChild.nextElementSibling.innerHTML;

  nameAndTimeAndDescription.innerHTML = nameAndTimeAndDescriptionInnerHTML
  applicantAvatar.innerHTML = applicantAvatarInnerHTML
  replyTo.innerHTML = replyToInnerHTML
  formGroup.setAttribute('action', `/tweets/${id}/replies`)
}

switchModal.forEach(tweet => {
  tweet.addEventListener('click', function onSwitchModalClicked(event) {
    const currentDOM = event.target.tagName === 'svg' ? event.target.parentElement : event.target
    const id = currentDOM.dataset.id;
    const newDOM = currentDOM.parentElement.parentElement;
    showReplyModal(newDOM, id)
  })
})
