const userName = document.querySelector('#user-edit-name')

userName.addEventListener('keyup', e => {
  const target = e.target
  const inputValue = target.value || ''

  if (inputValue.length > 50) alert('名字輸入不能超過 50 個字 !')
})
