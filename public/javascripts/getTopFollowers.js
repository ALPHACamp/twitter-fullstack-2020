const rightSideContainer = document.querySelector('.right-side-container')
const getTopFollowers = `${location.protocol} + ${window.location.host}/followships/top10`

// axios.get('http://http://localhost:3000/followships/top10')
//   .then((response) => console.log(response))
//   .catch((error) => console.log(error))

// DEFAULT CODE ////////////////////////
// const BASE_URL = 'https://lyric-api-403c0.firebaseio.com/'
// const songList = document.querySelector('#song-list')

// axios.get(getTopFollowers)
//   .then(function (response) {
//     rightSideContainer.innerHTML = `
//       ${response}
//       `
//     console.log(response.data.lyrics)
//   })
//   .catch(error => console.log(error))

axios.get('http://localhost:3000/followships/top10')
  .then((response) => {
    const { users, followingUserId } = response.data
    const following = followingUserId.map(following => following.followingId)
    let htmlContent = `
     <span class="font-lg-dark">推薦跟隨</span>
      <div class="hr-line"></div>
    `
    console.log(following.includes(2))
    users.forEach(topFollower => {
      if (following.includes(topFollower.id)) {
        htmlContent += `
           <form action="/followships/:${topFollower.id}?_method=DELETE" method="POST">
        <div class="d-flex justify-content-between align-items-center flex-row bd-highlight mb-3">
          <div class="bd-highlight">
            <a href="/users/${topFollower.id}/tweets">
              <img class="me-auto rounded-circle" src="${topFollower.avatar}" alt="avatar">
            </a>
          </div>
          <div class="name-container d-flex flex-column bd-highlight p-1">
            <a href="/users/${topFollower.id}/tweets">
              <div class="font-name">${topFollower.name}</div>
              <div class="font-account">${topFollower.account}</div>
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
        <input class="followingId" type="text" name="id" value="${topFollower.id}">
        <div class="d-flex justify-content-between align-items-center flex-row bd-highlight mb-3">
          <div class="bd-highlight">
            <a href="/users/${topFollower.id}/tweets">
              <img class="me-auto rounded-circle" src="${topFollower.avatar}" alt="avatar">
            </a>
          </div>
          <div class="name-container d-flex flex-column bd-highlight p-1">
            <a href="/users/${topFollower.id}/tweets">
              <div class="font-name">${topFollower.name}</div>
              <div class="font-account">${topFollower.account}</div>
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