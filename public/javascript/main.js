// 顯示更多
const displayMore = document.querySelector('.display-more')
const userList = document.querySelector('.user-list')

displayMore.addEventListener('click', event => {
  event.preventDefault()
  const orgHeight = parseInt(userList.style.height, 10)
  userList.style.height = (orgHeight > 100) ? '284px' : userList.scrollHeight + 'px'
  userList.style.transition = 'height .4s ease-out'
  userList.style.overflow = 'scroll'
  displayMore.style.visibility = 'hidden'
})
