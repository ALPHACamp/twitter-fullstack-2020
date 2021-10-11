const rightSideBar = document.querySelector('.rightSideBar')

if (rightSideBar) {
  const id = rightSideBar.dataset.userid
  axios.get(`/tweets/${id}/top10`)
  .then(response => {
    let topTwitters = response.data.topTwitters
    const userFollowingList = response.data.userFollowingList
    topTwitters = topTwitters.map(item => {
      return userFollowingList.includes(item.followingId) ? { ...item, followedByUser: true } : { ...item, followedByUser: false }
    })
    rightSideBar.innerHTML = topTwitters.reduce((acc, item) => {
      return item.followedByUser?(acc += `
        <div class="top-twitters">
          <div class="top-twitters-info">
            <a href="/users/${item.followingId}">
              <img src="${item.following.avatar}" alt="user avatar" class="tweets-img">
            </a>
            <div class="user-info">
              <span class="username">${item.following.name}</span>
              <span class="useraccount">${item.following.account}</span>
            </div>
          </div>

          <form action="/followships/${item.followingId}?_method=DELETE" method="POST">
            <button type="submit" class="following">正在跟隨</button>
          </form>
        </div>
      `
      ) : (acc += `
        <div class="top-twitters">
          <div class="top-twitters-info">
            <a href="/users/${item.followingId}">
              <img src="${item.following.avatar}" alt="user avatar" class="tweets-img">
            </a>
            <div class="user-info">
              <span class="username">${item.following.name}</span>
              <span class="useraccount">${item.following.account}</span>
            </div>
          </div>
          <form action="/followships" method="POST">
            <input type="text" class="top-twitter-id" name="id" value="${item.followingId}">
            <button type="submit" class="not-follow">跟隨</button>
          </form>
        </div>
      `
      )
    }, '<h4 class="right-side-title">跟隨誰</h4>')
  })
}