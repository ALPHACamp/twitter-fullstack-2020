const rightSideContainer = document.querySelector('.right-side-container')
const getTopFollowers = `${location.protocol}//${window.location.host}/followships/top10`

axios.get(getTopFollowers)
  .then((response) => {
    const { user, topFollowerUsers } = response.data
    const followingsId = user?.Followings?.map(f => f.id)
    let htmlContent = `
     <span class="font-lg-dark">推薦跟隨</span>
      <div class="hr-line"></div>
    `
    topFollowerUsers.forEach(topFollowerUser => {
      if (topFollowerUser.id === user.id) return
      if (followingsId.includes(topFollowerUser.id)) {
        htmlContent += `
        <form action="/followships/${topFollowerUser.id}?_method=DELETE" method="POST">
          <div class="d-flex justify-content-between align-items-center flex-row bd-highlight mb-3">
            <div class="bd-highlight">
              <a href="/users/${topFollowerUser.id}/tweets">
                <img class="me-auto rounded-circle" src="${topFollowerUser.avatar}" alt="avatar" style="width: 50px;height: 50px; border-radius:50%">
              </a>
            </div>
            <div class="name-container d-flex flex-column bd-highlight p-1">
              <a href="/users/${topFollowerUser.id}/tweets">
                <div class="font-name">${topFollowerUser.name}</div>
                <div class="font-account">@${topFollowerUser.account}</div>
              </a>
            </div>
            <div class="bd-highlight">
              <button type="submit" class="following-btn ms-1">
              正在跟隨
              </button>
            </div>
          </div>
        </form>
        `
      } else {
        htmlContent += `
        <form action="/followships" method="POST">
          <input class="followingId" type="text" name="id" value="${topFollowerUser.id}">
          <div class="d-flex justify-content-between align-items-center flex-row bd-highlight mb-3">
            <div class="bd-highlight">
              <a href="/users/${topFollowerUser.id}/tweets">
                <img class="me-auto rounded-circle" src="${topFollowerUser.avatar}" alt="avatar" style="width: 50px;height: 50px; border-radius:50%">
              </a>
            </div>
            <div class="name-container d-flex flex-column bd-highlight p-1">
              <a href="/users/${topFollowerUser.id}/tweets">
                <div class="font-name">${topFollowerUser.name}</div>
                <div class="font-account">${topFollowerUser.account}</div>
              </a>
            </div>
            <div class="bd-highlight">
              <button type="submit" class="follow-btn ms-1">
                跟隨
              </button>
            </div>
          </div>
        </form>
        `
      }
    })
    rightSideContainer.innerHTML = htmlContent
  })
  .catch((error) => console.log(error))