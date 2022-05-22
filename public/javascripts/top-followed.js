window.addEventListener('DOMContentLoaded', async e => {
  e.stopPropagation()
  const response = await axios({ method: 'get', url: `${BASE_URL}api/topfollowed` })
  const topFollowed = []
  topFollowed.push(...response.data.data.topFollowed)
  const topFollowedBox = document.querySelector('#top-followed-box')
  topFollowed.forEach((_, i) => {
    if (topFollowed[i].isSelf) {
      if (topFollowed[i].isFollowed) {
        topFollowedBox.innerHTML +=
        `<div
          class='follow-tweet d-flex flex-row align-items-center justify-content-between'
        >
          <a href='/users/${topFollowed[i].id}/tweets' class='d-flex'>
            <img class='avatar' src='${topFollowed[i].avatar}' alt='User2 avatar' />
            <div class='d-flex flex-column user-name-account'>
              <span class='user-name ellipsis'>${topFollowed[i].name}</span>
              <span class='secondary-text ellipsis'>@${topFollowed[i].account}</span>
            </div>
          </a>
              <form action='/followships/${topFollowed[i].id}?_method=DELETE' method='POST'>
                <button type='submit' class='btn btn-primary'>正在跟隨</button>
              </form>
        </div>`
      } else {
        topFollowedBox.innerHTML +=
        `<div
          class='follow-tweet d-flex flex-row align-items-center justify-content-between'
        >
          <a href='/users/${topFollowed[i].id}/tweets' class='d-flex'>
            <img class='avatar' src='${topFollowed[i].avatar}' alt='User2 avatar' />
            <div class='d-flex flex-column user-name-account'>
              <span class='user-name ellipsis'>${topFollowed[i].name}</span>
              <span class='secondary-text ellipsis'>@${topFollowed[i].account}</span>
            </div>
          </a>
              
              <form action='/followships' method='POST'>
                <input type='hidden' name='id' value='${topFollowed[i].id}' />
                <button type='submit' class='btn btn-outline'>跟隨</button>
              </form>
        </div>`
      }
    } else {
      topFollowedBox.innerHTML +=
        `<div
          class='follow-tweet d-flex flex-row align-items-center justify-content-between'
        >
          <a href='/users/${topFollowed[i].id}/tweets' class='d-flex'>
            <img class='avatar' src='${topFollowed[i].avatar}' alt='User2 avatar' />
            <div class='d-flex flex-column user-name-account'>
              <span class='user-name ellipsis'>${topFollowed[i].name}</span>
              <span class='secondary-text ellipsis'>@${topFollowed[i].account}</span>
            </div>
          </a>
        </div>`
    }
  })
})
