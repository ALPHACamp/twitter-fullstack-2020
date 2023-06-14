const targetNodes = []
const postTweetModal = document.getElementById('postTweetModal')
const editProfileModal = document.getElementById('editProfileModal')
const postReplyModal = document.getElementById('postReplyModal')
targetNodes.push(postTweetModal)
targetNodes.push(editProfileModal)
targetNodes.push(postReplyModal)

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

// 編輯個人資料相關
const editProfileButton = document.querySelector('#editProfileButton')
const putProfileButton = document.querySelector('#putProfileButton')

// 監聽按鈕 call API取得個人資料 把個人資料插入modal
editProfileButton.addEventListener('click', event => {
  const userId = editProfileButton.value
  const nameInput = document.querySelector('#name')
  const introInput = document.querySelector('#intro')
  const previewCover = document.querySelector('#previewCover')
  const previewAvatar = document.querySelector('#previewAvatar')
  axios.get(`/api/users/${userId}`)
    .then(response => {
      const { cover, avatar, name, intro } = response.data
      previewCover.src = cover
      previewAvatar.src = avatar
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
  const userId = editProfileButton.value
  // 取得使用者輸入的資料
  const name = document.querySelector('#name').value
  const intro = document.querySelector('#intro').value
  const avatar = document.querySelector('#avatarInput').files[0]
  const cover = document.querySelector('#coverInput').files[0]
  // 打包成FormData
  const formData = new FormData()
  formData.append('name', name)
  formData.append('intro', intro)
  formData.append('avatar', avatar)
  formData.append('cover', cover)
  // 發送打包好的formData
  axios.post(`/api/users/${userId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
    .then(response => {
      console.log(response)
      alert('個人資料已成功修改') // 給使用者顯示一個提示
    })
    .catch(err => {
      console.error('Error during API call:', err) // 在控制台中打印錯誤
      alert('An error occurred while fetching profile data.') // 給使用者顯示一個錯誤提示
    })
})

// 當avatarInput元素改變時會被呼叫 也就是當使用者選擇了要上傳的avatar
function previewAvatar() {
  const preview = document.querySelector('#previewAvatar')
  const file = document.querySelector('#avatarInput').files[0]
  const reader = new FileReader()

  // 定義好當reader完成讀取時的動作 將reader的結果交給preview元素顯示
  reader.onloadend = function () {
    preview.src = reader.result
  }
  // 如果file存在，就用reader物件將file轉換為DataURL，完成後會將DataURL存放在reader.result並觸發onloadend
  if (file) reader.readAsDataURL(file)
}

// 當coverInput元素改變時會被呼叫 也就是當使用者選擇了要上傳的cover
function previewCover() {
  const preview = document.querySelector('#previewCover')
  const file = document.querySelector('#coverInput').files[0]
  const reader = new FileReader()

  // 定義好當reader完成讀取時的動作 將reader的結果交給preview元素顯示
  reader.onloadend = function () {
    preview.src = reader.result
  }
  // 如果file存在，就用reader物件將file轉換為DataURL，完成後會將DataURL存放在reader.result並觸發onloadend
  if (file) reader.readAsDataURL(file)
}
