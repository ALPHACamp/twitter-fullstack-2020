// 監聽 登入頁面
const signIpPage = document.querySelector('#sign-in-page') || null
if (signIpPage) {
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

  signIpPage.addEventListener('input', event => {
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
    // 監聽password輸入框 一旦有動作 就恢復樣式且清空提示
    if (event.target.matches('#password')) {
      const passwordHelper = document.querySelector('#passwordHelper')
      const row = event.target.parentElement
      // 底線改藍色
      row.classList.remove('form-row', 'form-row-error', 'form-row-focus')
      row.classList.add('form-row-focus')
      // 清空提示
      passwordHelper.textContent = ''
    }
  })
}
