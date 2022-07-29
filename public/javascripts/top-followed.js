window.addEventListener('DOMContentLoaded', async e => {
  e.stopPropagation()
  const response = await axios.get('/users/topUsers')
  const topFollowed = []
  const currentUserId = Number(response.data.currentUser.id)
  topFollowed.push(...response.data.topUser)
  const topFollowedBox = document.querySelector('#top-users-container')
  topFollowed.forEach((_, i) => {
    if (topFollowed[i].isFollowed) {
      if (topFollowed[i].role === 'admin') return
      if (Number(topFollowed[i].id) === currentUserId) {
        console.log('123')
        return topFollowedBox.innerHTML += `<div class="top-users-container d-flex align-items-center mt-3 " id="top-users-container">
        <a href="/users/${topFollowed[i].id}/tweets"><img src="${topFollowed[i].avatar}" alt="" class="avatar-sm rounded-pill"></a>
        <div class="follow-list-user-name-account ms-2 mb-2 d-flex flex-column flex-grow-1 justify-content-start align-items-start" style="width: 240px;width: 50px; overflow: hidden;">
        <h6 class="user-name fw-bold fs-5 text-start mb-0 w-25">${topFollowed[i].name}</h6>
        <p class="user-account fw-normal fs-6 mb-0 w-25">@${topFollowed[i].account}</p>
        </div>
        </div>`
      }
      topFollowedBox.innerHTML += `<div class="top-users-container d-flex align-items-center mt-3 " id="top-users-container">
  <a href="/users/${topFollowed[i].id}/tweets"><img src="${topFollowed[i].avatar}" alt="" class="avatar-sm rounded-pill"></a>
  <div
    class="follow-list-user-name-account ms-2 mb-2 d-flex flex-column flex-grow-1 justify-content-start align-items-start" style="width: 240px;width: 50px;
  overflow: hidden;">
    <h6 class="user-name fw-bold fs-5 text-start mb-0 w-25">${topFollowed[i].name}</h6>
    <p class="user-account fw-normal fs-6 mb-0 w-25">@${topFollowed[i].account}</p>
  </div>
  <form action="http://localhost:3000/followships" method="POST" style="display:inline"
    class="follow-form d-flex justify-content-center ms-2">
    <input type="hidden" value="${topFollowed[i].id}" name="id">
    <button class="following-btn rounded-pill" type="submit">正在跟隨</button>
  </form>
</div>`
    } else {
      if (topFollowed[i].role === 'admin') return
      if (Number(topFollowed[i].id) === currentUserId) {
        console.log('123')
        return topFollowedBox.innerHTML += `<div class="top-users-container d-flex align-items-center mt-3 " id="top-users-container">
        <a href="/users/${topFollowed[i].id}/tweets"><img src="${topFollowed[i].avatar}" alt="" class="avatar-sm rounded-pill"></a>
        <div class="follow-list-user-name-account ms-2 mb-2 d-flex flex-column flex-grow-1 justify-content-start align-items-start" style="width: 240px;width: 50px; overflow: hidden;">
        <h6 class="user-name fw-bold fs-5 text-start mb-0 w-25">${topFollowed[i].name}</h6>
        <p class="user-account fw-normal fs-6 mb-0 w-25">@${topFollowed[i].account}</p>
        </div>
        </div>`
      }
      topFollowedBox.innerHTML += `<div class="top-users-container d-flex align-items-center mt-3" id="top-users-container">
       <a href="/users/${topFollowed[i].id}/tweets">
  <img src="${topFollowed[i].avatar}" alt="" class="avatar-sm rounded-pill">
  </a>
  <div
    class="follow-list-user-name-account ms-2 mb-2 d-flex flex-column flex-grow-1 justify-content-start align-items-start">
    <h6 class="user-name fw-bold fs-5 text-start mb-0 w-25">${topFollowed[i].name}</h6>
    <p class="user-account fw-normal fs-6 mb-0 w-25">@${topFollowed[i].account}</p>
  </div>
  <form action="http://localhost:3000/followships" method="POST" style="display:inline"
    class="follow-form d-flex justify-content-center ms-2">
    <input type="hidden" value="${topFollowed[i].id}" name="id">
    <button class="follow-btn rounded-pill" type="submit">跟隨</button>
  </form>
</div>`
    }
  })
})
