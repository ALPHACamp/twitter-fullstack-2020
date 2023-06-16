// 取得通知的容器
const notiContainer = document.getElementById('notification') || null

if (notiContainer) {
  const toasts = notiContainer.querySelectorAll('.toast')
  toasts.forEach(toast => {
    toast = new bootstrap.Toast(toast)
    // 顯現通知
    toast.show()
  })
}

// 設定監聽中的 Modal
const targetNodes = []
const postTweetModal = document.getElementById('postTweetModal') || null
const editProfileModal = document.getElementById('editProfileModal') || null
const postReplyModal = document.getElementById('postReplyModal') || null
const deleteTweetModal = document.getElementById('deleteTweetModal') || null

targetNodes.push(postTweetModal)
targetNodes.push(editProfileModal)
targetNodes.push(postReplyModal)
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
        // 抓出要監聽的 Modal 內部元件
        const ModalSubmitBtn = mutation.target.querySelector('#ModalSubmitBtn') || null
        const ModalTextarea = mutation.target.querySelector('#ModalTextarea') || null
        const ModalErrorMessage = mutation.target.querySelector('#ModalErrorMessage') || null
        const ModalCloseBtn = mutation.target.querySelector('#ModalCloseBtn') || null
        if (ModalSubmitBtn) {
          ModalSubmitBtn.addEventListener('click', modalErrorHandler)
          ModalCloseBtn.addEventListener('click', closeModalEventListener)
        }

        // 函式：消滅已產生的事件監聽器
        function closeModalEventListener(e) {
          ModalTextarea.value = ''
          ModalErrorMessage.innerText = ''
          ModalSubmitBtn.removeEventListener('click', modalErrorHandler)
          ModalCloseBtn.removeEventListener('click', closeModalEventListener)
        }

        // 函式：提供錯誤處理訊息，若符合發文條件則改變 btn.type 讓其可以發送
        function modalErrorHandler(e) {
          if (!ModalTextarea.value || ModalTextarea.value.trim() === '') {
            ModalErrorMessage.innerText = '內容不可空白'
          } else if (ModalTextarea.value.trim().length > 140) {
            ModalErrorMessage.innerText = '字數不可超過140字'
          } else {
            ModalErrorMessage.innerText = ''
            ModalSubmitBtn.removeEventListener('click', modalErrorHandler)
            ModalCloseBtn.removeEventListener('click', closeModalEventListener)
            ModalSubmitBtn.type = 'submit'
          }
        }
      } else {
        // 如果沒有 .show 將時刻維持回覆內容、錯誤訊息為空值
        const ModalTextarea = mutation.target.querySelector('#ModalTextarea') || null
        const ModalErrorMessage = mutation.target.querySelector('#ModalErrorMessage') || null
        if (ModalTextarea) { ModalTextarea.value = '' }
        if (ModalErrorMessage) { ModalErrorMessage.innerText = '' }
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

// 首頁推文區域錯誤事件處理
const mainPostTweet = document.getElementById('mainPostTweet') || null
if (mainPostTweet) {
  const ModalSubmitBtn = mainPostTweet.querySelector('#ModalSubmitBtn')
  const ModalTextarea = mainPostTweet.querySelector('#ModalTextarea')
  const ModalErrorMessage = mainPostTweet.querySelector('#ModalErrorMessage')

  ModalSubmitBtn.addEventListener('click', mainPostTweetErrorHandler)
  // 函式：提供錯誤處理訊息，若符合發文條件則改變 btn.type 讓其可以發送
  function mainPostTweetErrorHandler(e) {
    if (!ModalTextarea.value || ModalTextarea.value.trim() === '') {
      ModalErrorMessage.innerText = '內容不可空白'
    } else if (ModalTextarea.value.trim().length > 140) {
      ModalErrorMessage.innerText = '字數不可超過140字'
    } else {
      ModalErrorMessage.innerText = ''
      // 消滅現在的事件監聽器
      ModalSubmitBtn.removeEventListener('click', mainPostTweetErrorHandler)
      ModalSubmitBtn.type = 'submit'
    }
  }
}

// 監聽 編輯個人資料 相關按鈕
const centerColumn = document.querySelector('#center-column')
centerColumn.addEventListener('click', event => {
  // 監聽編輯個人資料按鈕 call API取得個人資料 把個人資料插入modal
  if (event.target.matches('#editProfileButton')) {
    const userId = document.querySelector('#editProfileButton').value
    const putProfileButton = document.querySelector('#putProfileButton')
    const nameInput = document.querySelector('#name')
    const introInput = document.querySelector('#intro')
    const previewCover = document.querySelector('#previewCover')
    const previewAvatar = document.querySelector('#previewAvatar')
    const nameHelper = document.querySelector('#nameHelper')
    const nameCount = document.querySelector('#nameCount')
    const introHelper = document.querySelector('#introHelper')
    const introCount = document.querySelector('#introCount')
    const nameRow = nameInput.parentElement
    const introRow = introInput.parentElement

    // 欄位樣式恢復初始值
    nameCount.textContent = ''
    nameHelper.textContent = ''
    introCount.textContent = ''
    introHelper.textContent = ''
    // 如果底線是紅色，就恢復灰色
    if (nameRow.classList.contains('form-row-error')) {
      nameRow.classList.remove('form-row-error')
      nameRow.classList.add('form-row')
    }
    if (introRow.classList.contains('form-row-error')) {
      introRow.classList.remove('form-row-error')
      introRow.classList.add('form-row')
    }
    // 啟用儲存按鈕
    putProfileButton.dataset.nameErr = false
    putProfileButton.dataset.introErr = false
    putProfileButton.disabled = false

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
  }
  // 監聽儲存按鈕 call API更新個人資料 關閉Modal刷新個人資料頁面
  if (event.target.matches('#putProfileButton')) {
    const userId = document.querySelector('#editProfileButton').value
    // 取得使用者輸入的資料
    const name = document.querySelector('#name').value
    const intro = document.querySelector('#intro').value
    const avatar = document.querySelector('#avatarInput').files[0]
    const cover = document.querySelector('#coverInput').files[0]
    const coverReset = document.querySelector('#previewCover').dataset.reset
    // 打包成FormData
    const formData = new FormData()
    formData.append('name', name)
    formData.append('intro', intro)
    formData.append('avatar', avatar)
    formData.append('cover', cover)
    formData.append('coverReset', coverReset)
    // 發送打包好的formData
    axios.post(`/api/users/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(() => {
        window.location.href = `/users/${userId}/tweets` // 前往個人資料頁面
      })
      .catch(err => {
        console.error('Error during API call:', err) // 在控制台中打印錯誤
        alert('An error occurred while fetching profile data.') // 給使用者顯示一個錯誤提示
      })
  }
  if (event.target.matches('#removeCoverButton')) {
    // 監聽封面上的X按鈕 把封面換成初始值
    const previewCover = document.querySelector('#previewCover')
    previewCover.src = 'https://i.imgur.com/b7U6LXD.jpg'
    previewCover.dataset.reset = 'true'
  }
})
centerColumn.addEventListener('input', event => {
  // 監聽名稱輸入框
  if (event.target.matches('#name')) {
    const putProfileButton = document.querySelector('#putProfileButton')
    const nameHelper = document.querySelector('#nameHelper')
    const nameCount = document.querySelector('#nameCount')
    const row = event.target.parentElement
    const value = event.target.value
    // 更新字數
    nameCount.textContent = `${value.length}/50`
    // 檢查字數
    if (value.length > 50) {
      // 如果底線是灰色，就改紅色
      if (row.classList.contains('form-row')) {
        row.classList.remove('form-row')
        row.classList.add('form-row-error')
      }
      // 禁用儲存按鈕 記錄錯誤狀態
      putProfileButton.disabled = true
      putProfileButton.dataset.nameErr = 'true'
      // 顯示提示
      nameHelper.textContent = '字數超出上限！'
      // 檢查是否空白
    } else if (value.trim() === '') {
      // 如果底線是灰色，就改紅色
      if (row.classList.contains('form-row')) {
        row.classList.remove('form-row')
        row.classList.add('form-row-error')
      }
      // 禁用儲存按鈕 記錄錯誤狀態
      putProfileButton.disabled = true
      putProfileButton.dataset.nameErr = 'true'
      // 顯示提示
      nameHelper.textContent = '名稱不可空白！'
    } else {
      // 如果底線是紅色，就改灰色
      if (row.classList.contains('form-row-error')) {
        row.classList.remove('form-row-error')
        row.classList.add('form-row')
      }
      // 清空提示
      nameHelper.textContent = ''
      // 清除錯誤狀態
      putProfileButton.dataset.nameErr = 'false'
      // 檢查另一欄位的錯誤狀態 來決定是否啟用儲存按鈕
      if (putProfileButton.dataset.introErr !== 'true') putProfileButton.disabled = false
    }
  }
  // 監聽自我介紹輸入框
  if (event.target.matches('#intro')) {
    const putProfileButton = document.querySelector('#putProfileButton')
    const introHelper = document.querySelector('#introHelper')
    const introCount = document.querySelector('#introCount')
    const row = event.target.parentElement
    const value = event.target.value
    // 更新字數
    introCount.textContent = `${value.length}/160`
    // 檢查字數
    if (value.length > 160) {
      // 如果底線是灰色，就改紅色
      if (row.classList.contains('form-row')) {
        row.classList.remove('form-row')
        row.classList.add('form-row-error')
      }
      // 禁用儲存按鈕 記錄錯誤狀態
      putProfileButton.disabled = true
      putProfileButton.dataset.introErr = 'true'
      // 顯示提示
      introHelper.textContent = '字數超出上限！'
    } else {
      // 如果底線是紅色，就改灰色
      if (row.classList.contains('form-row-error')) {
        row.classList.remove('form-row-error')
        row.classList.add('form-row')
      }
      // 清空提示
      introHelper.textContent = ''
      // 清除錯誤狀態
      putProfileButton.dataset.introErr = 'false'
      // 檢查另一欄位的錯誤狀態 來決定是否啟用儲存按鈕
      if (putProfileButton.dataset.nameErr !== 'true') putProfileButton.disabled = false
    }
  }
})

// 預覽大頭貼 當avatarInput元素改變時會被呼叫 也就是當使用者選擇了要上傳的avatar
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

// 預覽封面 當coverInput元素改變時會被呼叫 也就是當使用者選擇了要上傳的cover
function previewCover() {
  const preview = document.querySelector('#previewCover')
  const file = document.querySelector('#coverInput').files[0]
  const reader = new FileReader()

  // 定義好當reader完成讀取時的動作 將reader的結果交給preview元素顯示
  reader.onloadend = function () {
    preview.src = reader.result
    preview.dataset.reset = 'false' // 若使用者在預覽階段先恢復預設再選擇檔案，就需要將reset改為false
  }
  // 如果file存在，就用reader物件將file轉換為DataURL，完成後會將DataURL存放在reader.result並觸發onloadend
  if (file) reader.readAsDataURL(file)
}

// 後台 admin 監聽刪除按紐
const deleteTweetButton = document.querySelectorAll('.deleteTweetButton')

if (deleteTweetButton) {
  // 每個刪除按鈕加上監聽器
  deleteTweetButton.forEach(button => {
    // 監聽按鈕 call API 取得推文資料 把個人資料插入 modal
    button.addEventListener('click', () => {
      const tweetId = button.value
      console.log('tweetId 是：', tweetId)
      const ModalUserName = deleteTweetModal.querySelector('#ModalUserName')
      const ModalUserAvatar = deleteTweetModal.querySelector('#ModalUserAvatar')
      const ModalUserAccount1 = deleteTweetModal.querySelector('#ModalUserAccount1')
      const ModalDescription = deleteTweetModal.querySelector('#ModalDescription')
      const ModalForm = deleteTweetModal.querySelector('#ModalForm')
      // deleteTweetModal.getElementById
      axios.get(`/api/admin/tweets/${tweetId}`)
        .then(response => {
          const { name, avatar, account } = response.data.tweet.User
          const { description } = response.data.tweet
          // 更改 Modal 中的資料
          ModalUserName.textContent = name
          ModalUserAvatar.src = avatar
          ModalUserAccount1.textContent = account
          ModalDescription.textContent = description
          ModalForm.action = `/admin/tweets/${tweetId}?_method=DELETE`
          console.log('response為:', response)
        })
        .catch(err => {
          console.error('Error during API call:', err) // 在控制台中打印錯誤
          alert('An error occurred while fetching tweet data.') // 給使用者顯示一個錯誤提示
        })
    })
  })
}
