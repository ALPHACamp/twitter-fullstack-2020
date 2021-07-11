// 取得 Toast 事件時間
function append_zero(element) {
  if (element < 10) {
    return '0' + element
  } else {
    return '' + element
  }
}

function get_date() {
  const date = new Date()
  const hour = date.getHours() // 0 ~ 23
  const minutes = date.getMinutes() // 0 ~ 59
  const second = date.getSeconds() // 0 ~ 59
  return append_zero(hour) + '-' + append_zero(minutes) + '-' + append_zero(second)
}
// Toast 元件選項, # 預設值: {animation: true, autohide: true, delay: 5000 } (5秒)
const option = {
  animation: true,
  autohide: true,
  delay: 500
}
// DOM 元件
const tweetModal = document.getElementById('exampleModal')
const toastAlert = document.getElementById('liveToast')
const toastTime = toastAlert.querySelector('small')
const toastText = toastAlert.querySelector('.toast-body')
const submitForm = document.getElementById('newTweetForm')
// 初始化元件, 使其具有功能選項
const toast = new bootstrap.Toast(toastAlert)
const modal = new bootstrap.Modal(tweetModal)
let modalText = ''
// const toast = new bootstrap.Toast(toastAlert, option); // 添加 Toast 選項用法

// Modal 點開事件
if (tweetModal != null) {
  modalText = document.getElementById('newTweet')
  tweetModal.addEventListener('shown.bs.modal', function (e) {
    modalText.value = ''
    toastTime.textContent = get_date()
    toastText.textContent = '開始推文'
    toast.show()
  })
}

// Modal submit 事件處理, 先停止 submit 動作, 判定合法推文, 再呼叫 submit 處理
function submitButtonClick(event) {
  event.preventDefault();
  //other stuff you want to do instead...
  if (modalText.value === '') {
    toastTime.textContent = get_date()
    toastText.textContent = '推文失敗: 沒有推文內容!'
    toast.show()
  } else if (modalText.value.length > 140) {
    toastTime.textContent = get_date()
    toastText.textContent = '推文失敗: 超過字數限制!'
    toast.show()
  } else {
    toastTime.textContent = get_date()
    toastText.textContent = '推文成功!'
    toast.show()
    submitForm.submit()
    modalText.value = ''
    modal.hide()
  }
}