// 監聽 帳戶設定頁面
const settingPage = document.querySelector('#setting-page') || null
if (settingPage) {
  const inputs = document.querySelectorAll('input')
  // 所有輸入框個別加上focus跟blur監聽器
  inputs.forEach(function (input) {
    input.addEventListener('focus', function () {
      // 底線改藍色
      this.parentElement.classList.remove('form-row', 'form-row-error', 'form-row-focus')
      this.parentElement.classList.add('form-row-focus')
    })
    input.addEventListener('blur', function () {
      // 底線改灰色
      this.parentElement.classList.remove('form-row', 'form-row-error', 'form-row-focus')
      this.parentElement.classList.add('form-row')
    })
  })

  settingPage.addEventListener('input', event => {
    // 監聽名稱輸入框
    if (event.target.matches('#name')) {
      const putSettingButton = document.querySelector('#put-setting-button')
      const nameHelper = document.querySelector('#nameHelper')
      const nameCount = document.querySelector('#nameCount')
      const row = event.target.parentElement
      const value = event.target.value
      // 更新字數
      nameCount.textContent = `${value.length}/50`
      // 檢查字數
      if (value.length > 50) {
        // 底線改紅色
        row.classList.remove('form-row', 'form-row-error', 'form-row-focus')
        row.classList.add('form-row-error')
        // 禁用儲存按鈕 記錄錯誤狀態
        putSettingButton.disabled = true
        // 顯示提示
        nameHelper.textContent = '字數超出上限！'
        // 檢查是否空白
      } else if (value.trim() === '') {
        // 底線改紅色
        row.classList.remove('form-row', 'form-row-error', 'form-row-focus')
        row.classList.add('form-row-error')
        // 禁用儲存按鈕 記錄錯誤狀態
        putSettingButton.disabled = true
        putSettingButton.dataset.nameErr = 'true'
        // 顯示提示
        nameHelper.textContent = '名稱不可空白！'
      } else {
        // 底線改藍色
        row.classList.remove('form-row', 'form-row-error', 'form-row-focus')
        row.classList.add('form-row-focus')
        // 清空提示
        nameHelper.textContent = ''
        // 恢復儲存按鈕可用
        putSettingButton.disabled = false
      }
    }
    // 監聽帳號輸入框 一旦有動作 就恢復樣式且清空提示
    if (event.target.matches('#account')) {
      const accountHelper = document.querySelector('#accountHelper')
      const row = event.target.parentElement
      // 底線改藍色
      row.classList.remove('form-row', 'form-row-error', 'form-row-focus')
      row.classList.add('form-row-focus')
      // 清空提示
      accountHelper.textContent = ''
    }
    // 監聽email輸入框 一旦有動作 就恢復樣式且清空提示
    if (event.target.matches('#email')) {
      const emailHelper = document.querySelector('#emailHelper')
      const row = event.target.parentElement
      // 底線改藍色
      row.classList.remove('form-row', 'form-row-error', 'form-row-focus')
      row.classList.add('form-row-focus')
      // 清空提示
      emailHelper.textContent = ''
    }
    // 監聽確認密碼輸入框 一旦有動作 就恢復樣式且清空提示
    if (event.target.matches('#checkPassword')) {
      const checkPasswordHelper = document.querySelector('#checkPasswordHelper')
      const row = event.target.parentElement
      // 底線改藍色
      row.classList.remove('form-row', 'form-row-error', 'form-row-focus')
      row.classList.add('form-row-focus')
      // 清空提示
      checkPasswordHelper.textContent = ''
    }
  })
}
