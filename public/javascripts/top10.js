const top10List = document.querySelector('#top10').children[0]
const getTop10 = async (showNumber, showButton) => {
  let top10 = await axios.get('http://localhost:8000/api/top10')
  top10 = top10.data
  let user = await axios.get(`http://localhost:8000/api/users/${top10List.parentElement.dataset.userId}`)
  user = user.data
  top10.map((top, i) => {
    if (i + 1 > showNumber) return
    if (!top.avatar) top.avatar = "https://i.imgur.com/3P9xRqb.jpeg"
    if (top.Followers.map(follower => follower.id).includes(user.id)) {
      top.action = `/followships/${top.id}?_method=DELETE`
      top.class = "btn btn-regular rounded-pill"
      top.text = '正在跟隨'
      top.hiden = ""
      top.value = ""
    } else {
      top.action = `/followships`
      top.class = "btn btn-outline-regular rounded-pill"
      top.text = '跟隨'
      top.hiden = "true"
      top.value = top.id
    }
    if (top.id === user.id) {
      top.class += " invisible"
    }
    top10List.innerHTML += `<li class="list-group-item p-0 border-top">
                <div class="d-flex justify-content-between">
                  <div class="d-flex" >
                    <div style="width: 50px;height: 50px;" class="col-auto m-2">
                    <img src="${top.avatar}" class="rounded-circle"  style="width:100%; height:100%;"></div>
                    <div class="d-flex flex-column justify-content-center" style="line-height: 1;">
                      <p class="m-0">${top.name}</p>
                      <a href="/users/${top.id}" class="user-link">@${top.account}</a>
                    </div>
                  </div>
                  <div class="d-flex align-items-center me-2">
                    <form action="${top.action}" method="post">
                            <input type="hidden" name="id" id="id" value="${top.value}">
                      <button type="submit" class="${top.class}">${top.text}</button>
                    </form>
                  </div>
                </div>
              </li>`
  })
  if (showButton) {
    top10List.innerHTML += `<li class="list-group-item p-0 border-top"><button class="btn orange-button" id="more-button">顯示更多</button></li>`
    const moreButton = document.querySelector('#more-button')
    moreButton.addEventListener('click', () => {
      top10List.innerHTML = `<li class="list-group-item fw-bolder">跟隨誰</li>`
      getTop10(10, false)
    })
  }
}


getTop10(5, true)




