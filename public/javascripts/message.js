// 檢查是否存在動態錯誤訊息框
const errorMessageDiv = document.querySelector('.error-message')

if (errorMessageDiv) {
  // 確保錯誤訊息框開始時是隱藏的
  errorMessageDiv.style.top = '-100%'

  // 使用setTimeout來確保它有足夠的時間從-100%滑到10%
  setTimeout(() => {
    // 滑出錯誤訊息框
    errorMessageDiv.style.top = '10%'

    // 等待5秒
    setTimeout(() => {
      // 收回錯誤訊息框
      errorMessageDiv.style.top = '-100%'
    }, 3000)
  }, 50) // 等待50毫秒，給予滑動效果足夠的時間
}
