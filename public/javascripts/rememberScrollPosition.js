if (!isSettingPage) {
  const sidebar = document.querySelector('.scrollbar-hidden')

  const topScroll = localStorage.getItem('sidebar-scroll')
  if (topScroll !== null) {
    sidebar.scrollTop = parseInt(topScroll, 10)
  }

  window.addEventListener('beforeunload', () => {
    localStorage.setItem('sidebar-scroll', sidebar.scrollTop)
  })
}
