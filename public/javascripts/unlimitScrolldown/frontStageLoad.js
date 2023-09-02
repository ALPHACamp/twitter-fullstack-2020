/*
if (!isSettingPage) {
  let scrollHight = 0
  const scrollContainer = document.querySelector('.scrollbar-hidden')
  const mainColHeight = document.querySelector('.main-middle-col').offsetHeight
  if (isUserPage) {
    const titleHeight = document.querySelector('.partial-title').offsetHeight
    const userCardHeight = document.querySelector('.homepage-user-card').offsetHeight
    const userTabHeight = document.querySelector('#user-tab').offsetHeight
    scrollHight = mainColHeight - titleHeight - userCardHeight - userTabHeight
    scrollContainer.style.height = scrollHight
  } else if (isTweetPage) {
    const titleHeight = document.querySelector('.partial-title').offsetHeight
    const postTweetAreaHeight = document.querySelector('.post-tweet-area').offsetHeight
    const divbarHeigth = document.querySelector('.division').offsetHeight
    scrollHight = mainColHeight - titleHeight - postTweetAreaHeight - divbarHeigth
    scrollContainer.style.height = scrollHight
  } else if (isRepliesPage) {
    const titleHeight = document.querySelector('.partial-title').offsetHeight
    const tweetReplyHeight = document.querySelector('.tweet-reply').offsetHeight
    const divbarHeigth = document.querySelector('.division').offsetHeight
    scrollHight = mainColHeight - titleHeight - tweetReplyHeight - divbarHeigth
    scrollContainer.style.height = scrollHight
  }
}
*/
async function loadMoreData (link) {
  // 使用 AJAX 來從伺服器獲取更多資料
  try {
    const response = await axios.get(link)
    return response.data
  } catch (error) {
    console.error(error)
  }
}
