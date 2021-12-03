const listTweet = document.querySelector('.list-tweet')
const profileBtn = document.querySelector('#profile-buttons')

profileBtn.addEventListener('click', event => {
  const target = event.target

  // USER TWEETS
  if (target.matches('#tweets')) {
    profileBtn.children[0].classList.add('item-active')
    profileBtn.children[1].classList.remove('item-active')
    profileBtn.children[2].classList.remove('item-active')

    listTweet.children[0].classList.remove('d-none')
    listTweet.children[1].classList.add('d-none')
    listTweet.children[2].classList.add('d-none')

    return
  }

  // USER REPLIES
  if (target.matches('#replies')) {
    profileBtn.children[0].classList.remove('item-active')
    profileBtn.children[1].classList.add('item-active')
    profileBtn.children[2].classList.remove('item-active')

    listTweet.children[0].classList.add('d-none')
    listTweet.children[1].classList.remove('d-none')
    listTweet.children[2].classList.add('d-none')

    return
  }

  // USER LIKES
  if (target.matches('#likes')) {
    profileBtn.children[0].classList.remove('item-active')
    profileBtn.children[1].classList.remove('item-active')
    profileBtn.children[2].classList.add('item-active')

    listTweet.children[0].classList.add('d-none')
    listTweet.children[1].classList.add('d-none')
    listTweet.children[2].classList.remove('d-none')

    return
  }
})