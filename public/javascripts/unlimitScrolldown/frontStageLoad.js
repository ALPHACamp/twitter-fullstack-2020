if (!isSettingPage) {
  let scrollHight = 0
  const scrollContainer = document.querySelector('.scrollbar-hidden')
  if (isUserPage) {
    const mainColHeight = document.querySelector('.main-middle-col').offsetHeight
    const titleHeight = document.querySelector('.partial-title').offsetHeight
    const userCardHeight = document.querySelector('.homepage-user-card').offsetHeight
    const userTabHeight = document.querySelector('#user-tab').offsetHeight
    scrollHight = mainColHeight - titleHeight - userCardHeight - userTabHeight
    scrollContainer.style.height = scrollHight
  }
}
