const targetNodes = []
const deleteTweetModal = document.getElementById('deleteTweetModal')
targetNodes.push(deleteTweetModal)

// 取得目前現在視窗大小的函式
function updatePageHeight() {
  let pageHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight
  )
  pageHeight = pageHeight - 30
  return pageHeight
}

let pageHeight = updatePageHeight()

// 如果視窗有被調整，要重新取得視窗大小
window.addEventListener('resize', function () {
  pageHeight = updatePageHeight()
})

const observer = new MutationObserver(function async(mutationsList, observer) {
  for (const mutation of mutationsList) {
    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
      // 如果監聽對象的 class 有 show 的話
      if (mutation.target.classList.contains('show')) {
        // 將他的 top 設定到固定位置
        mutation.target.style.top = `-${pageHeight}px`
      }
    }
  }
})

const observerOptions = {
  attributes: true,
  attributeFilter: ['class']
}

targetNodes.forEach(function (targetNode) {
  observer.observe(targetNode, observerOptions)
})

// 後台 admin 監聽刪除按紐
const formAction = document.getElementById('deleteTweetForm')
const deleteTweetButton = document.getElementById('deleteTweetButton')

if (deleteTweetButton) {
  // 監聽按鈕 call API 取得推文資料 把個人資料插入 modal
  deleteTweetButton.addEventListener('click', () => {
    const tweetId = deleteTweetButton.value
    console.log('tweetId 是：', tweetId)
    const ModalUserName = document.getElementById('ModalUserName')
    const ModalUserAvatar = document.getElementById('ModalUserAvatar')
    const ModalUserAccount1 = document.getElementById('ModalUserAccount1')
    const ModalDescription = document.getElementById('ModalDescription')
    const ModalForm = document.getElementById('ModalForm')
    const action = formAction.getAttribute('action')
    axios.get(`/api/admin/tweets/${tweetId}`)
      .then(response => {
        const { name, avatar, account } = response.data.tweet.User
        const { description } = response.data.tweet
        // 更改 Modal 中的資料
        ModalUserName.textContent = name
        ModalUserAvatar.src = avatar
        ModalUserAccount1.textContent = account
        ModalDescription.textContent = description
        ModalForm.setAttribute('action', action)
        console.log('response為:', response)
        console.log(ModalDescription.innerText)
      })
      .catch(err => {
        console.error('Error during API call:', err) // 在控制台中打印錯誤
        alert('An error occurred while fetching tweet data.') // 給使用者顯示一個錯誤提示
      })
  })
}
