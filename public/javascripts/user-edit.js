const userName = document.querySelector('#user-edit-name')

// 在此抓取的 target 只有 input 有 keyup 功能
userName.addEventListener('keyup', e => {
  const target = e.target
  const inputValue = target.value || ''

  if (inputValue.length > 50) alert('名字輸入不能超過 50 個字 !')
})
