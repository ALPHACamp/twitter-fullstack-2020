const targetNodes = []
const postTweetModal = document.getElementById('postTweetModal')
const editProfileModal = document.getElementById('editProfileModal')
const postReplyModal = document.getElementById('postReplyModal')
targetNodes.push(postTweetModal)
targetNodes.push(editProfileModal)
targetNodes.push(postReplyModal)

// 取得目前現在視窗大小的函式
function updatePageHeight () {
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

const observer = new MutationObserver(function async (mutationsList, observer) {
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

// 編輯個人資料相關
const editProfileButton = document.querySelector('#editProfileButton')
const putProfileButton = document.querySelector('#putProfileButton')
const nameInput = document.querySelector('#name')
const introInput = document.querySelector('#intro')
const userId = editProfileButton.value

// 監聽按鈕 call API取得個人資料 把個人資料插入modal
editProfileButton.addEventListener('click', event => {
  // 待補上：檢查是否為本人
  axios.get(`/api/users/${userId}`)
    .then(response => {
      const { name, intro } = response.data
      nameInput.value = name
      introInput.value = intro
    })
    .catch(err => {
      console.error('Error during API call:', err) // 在控制台中打印錯誤
      alert('An error occurred while fetching profile data.') // 給使用者顯示一個錯誤提示
    })
})

// 監聽按鈕 call API更新個人資料 把個人資料插入modal
putProfileButton.addEventListener('click', event => {
  // 取得使用者輸入的資料
  const name = nameInput.value
  const intro = introInput.value
  // 待補上：檢查是否為本人
  axios.post(`/api/users/${userId}`, { name, intro })
    .then(response => {
      const { name, intro } = response.data
      nameInput.value = name
      introInput.value = intro
      alert('個人資料已成功修改') // 給使用者顯示一個提示
    })
    .catch(err => {
      console.error('Error during API call:', err) // 在控制台中打印錯誤
      alert('An error occurred while fetching profile data.') // 給使用者顯示一個錯誤提示
    })
})
