const getTweetButton = document.querySelectorAll('.getTweetButton')

if (getTweetButton) {
  // 在每個回覆按鈕都加上監聽器
  getTweetButton.forEach(button => {
    button.addEventListener('click', () => {
      const tweetId = button.value
      const ModalUserName = document.getElementById('ModalUserName')
      const ModalUserAvatar = document.getElementById('ModalUserAvatar')
      const ModalUserAccount1 = document.getElementById('ModalUserAccount1')
      const ModalUserAccount2 = document.getElementById('ModalUserAccount2')
      const ModalDescription = document.getElementById('ModalDescription')
      const ModalCurrentUserAvatar = document.getElementById('ModalCurrentUserAvatar')
      const ModalReplyForm = document.getElementById('ModalReplyForm')
      // 呼叫 api 取得特定貼文資料
      axios.get(`/api/tweets/${tweetId}`)
        .then(response => {
          const { name, avatar, account } = response.data.tweet.User
          const { description, id } = response.data.tweet
          const currentUserAvatar = response.data.currentUser.avatar
          // 更改 Modal 中的資料
          ModalUserName.innerText = name
          ModalUserAvatar.src = avatar
          ModalUserAccount1.innerText = account
          ModalUserAccount2.innerText = account
          ModalDescription.innerText = description
          ModalCurrentUserAvatar.src = currentUserAvatar
          ModalReplyForm.action = `/tweets/${id}/replies`
          console.log(response)
        })
        .catch(err => {
          console.error('Error during API call:', err) // 在控制台中打印錯誤
          alert('An error occurred while fetching tweet data.') // 給使用者顯示一個錯誤提示
        })
    })
  })
}
