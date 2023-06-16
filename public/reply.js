const getTweetButton = document.querySelectorAll('.getTweetButton') || null
const ReplyModal = document.getElementById('postReplyModal') || null

if (getTweetButton) {
  // 在每個回覆按鈕都加上監聽器
  getTweetButton.forEach(button => {
    button.addEventListener('click', () => {
      const tweetId = button.value
      const ModalUserName = ReplyModal.querySelector('#ModalUserName')
      const ModalUserAvatar = ReplyModal.querySelector('#ModalUserAvatar')
      const ModalUserAccount1 = ReplyModal.querySelector('#ModalUserAccount1')
      const ModalUserAccount2 = ReplyModal.querySelector('#ModalUserAccount2')
      const ModalDescription = ReplyModal.querySelector('#ModalDescription')
      const ModalCurrentUserAvatar = ReplyModal.querySelector('#ModalCurrentUserAvatar')
      const ModalReplyForm = ReplyModal.querySelector('#ModalReplyForm')
      const ModalTweetFromNow = ReplyModal.querySelector('#ModalTweetFromNow')
      // 呼叫 api 取得特定貼文資料
      axios.get(`/api/tweets/${tweetId}`)
        .then(response => {
          const { name, avatar, account } = response.data.tweet.User
          const { description, id, fromNow } = response.data.tweet
          const currentUserAvatar = response.data.currentUser.avatar
          // 更改 Modal 中的資料
          ModalUserName.innerText = name
          ModalUserAvatar.src = avatar
          ModalUserAccount1.innerText = account
          ModalUserAccount2.innerText = account
          ModalDescription.innerText = description
          ModalCurrentUserAvatar.src = currentUserAvatar
          ModalReplyForm.action = `/tweets/${id}/replies`
          ModalTweetFromNow.innerText = fromNow
        })
        .catch(err => {
          console.error('Error during API call:', err) // 在控制台中打印錯誤
          alert('An error occurred while fetching tweet data.') // 給使用者顯示一個錯誤提示
        })
    })
  })
}
