// 直接load axios檔案在javascript中所以不用再import
// import axios from 'axios'
const container = document.querySelector('.scrollbar-hidden')
const row = document.querySelector('.scrollbar-hidden .row')
const USERS_LIMIT = 8
let usersPage = 0

container.addEventListener('scroll', async () => {
  if (container.scrollHeight - container.scrollTop <= container.clientHeight + 250) { // 拉到往上10公分時就會 reload
  // 這裡是到達底部時需要執行的代碼，例如發送請求從 DB 加載更多數據
    let moreUsers = await loadMoreUsers()
    if (!moreUsers.data) {
      return null
    }

    moreUsers = moreUsers.data.map(user => {
      const html = `
              <div class="col-3 p-2">
                <div class="card position-relative border-0 shadow-none m-0">
                  <img src="${user.cover}" class="card-img-top user-cover" alt="..." />
                  <div class="card-body d-flex flex-column justify-content-center align-items-center">
                    <div
                      class="user-info position-absolute d-flex flex-column justify-content-center align-items-center">
                      <div class="d-flex flex-column align-items-center gap-2 mb-3">
                        <img src="${user.avatar}" class="user-avatar" alt="" />
                        <div>
                          <p class="fw-bold fs-6 m-0 p-0">${user.name}</p>
                          <p class="font-size-sm text-secondary m-0 p-0">
                            @${user.account}
                          </p>
                        </div>
                      </div>
                      <div class="user-like d-flex gap-3 m-0 mb-2">
                        <div class="gap-2">
                          <img src="/images/icons/Vector.svg" alt="" class="text-secondary" />
                          <span class="fs-6">${user.tweetCount}</span>
                        </div>
                        <div class="gap-2">
                          <img src="/images/icons/icon_like_outlined.svg" alt="" class="text-secondary" />
                          <span class="fs-6">${user.likeCount}</span>
                        </div>
                      </div>
                      <div class="user-followship d-flex gap-2 font-size-sm">
                        <p>
                          ${user.followingCount} 個<span class="text-secondary">跟隨中</span>
                        </p>
                        <p>
                          ${user.followerCount} 位<span class="text-secondary">跟隨者</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
        `
      return html
    })
    row.innerHTML += moreUsers.join('')
    // Get delete button
  }
})

async function loadMoreUsers () {
  // 使用 AJAX 來從伺服器獲取更多資料
  try {
    usersPage += 1
    const response = await axios.get(`/admin/usersUnload?limit=${USERS_LIMIT}&page=${usersPage}`)
    return response.data
  } catch (error) {
    console.error(error)
  }
}
