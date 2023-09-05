const adminTweets = document.getElementById('adminTweets')
const adminUsers = document.getElementById('adminUsers')
const adminLogout = document.getElementById('adminLogout')

window.addEventListener('scroll', function () {
  // 將滾動位置存儲在localStorage中
  localStorage.setItem('scrollPosition', window.scrollY)
})

window.addEventListener('load', function () {
  // 從localStorage中讀取滾動位置
  const scrollPosition = localStorage.getItem('scrollPosition')
  if (scrollPosition) {
    // 將頁面滾動到存儲的位置
    window.scrollTo(0, scrollPosition)
    // 清除localStorage中的滾動位置
    localStorage.removeItem('scrollPosition')
  }
})

adminTweets.addEventListener('click', function () {
  localStorage.removeItem('scrollPosition')
})

adminUsers.addEventListener('click', function () {
  localStorage.removeItem('scrollPosition')
})

adminLogout.addEventListener('click', function () {
  localStorage.removeItem('scrollPosition')
})
