const adminTweets = document.querySelector('.admin-tweets-list')
const body = document.querySelector('body')
const html = document.querySelector('html')

if (adminTweets) {
  window.addEventListener('scroll', (e) => {
    const adminItem = document.querySelectorAll('.admin-list-item')
    const clientHeight = adminTweets.clientHeight;
    const scrollTop = html.scrollTop;
    const scrollHeight = html.scrollHeight;

    if (scrollTop + clientHeight === scrollHeight) {
      axios
        .get(`http://localhost:3000/api/admin/tweets/${adminItem.length}`)
        .then(data => {
          tweetTemplate(data.data)
        })
        .catch(() => {return console.log('Load error')})
    }
  })
}

function tweetTemplate(data) {
  let finalTemplate = ''
  for (let i = 0; i < data.length; i++) {
    finalTemplate += `
    <div class="admin-list-item">
      <div class="admin-list-left">
        <img src="${data[i].User.avatar}" class="rounded-circle" style="width: 50px;height:50px;">
        <div class="right-list-item">
          <div class="list-item-info">
            <div class="list-name">
              <a>${data[i].User.name}</a>
              <span>@${data[i].User.account} · ${data[i].updatedAt}</span>
            </div>
            <p>${data[i].description}</p>
          </div>
        </div>
      </div>
      <div class="admin-list-right">
        <form action="/admin/tweets/${data[i].id}?_method=DELETE" method="POST">
          <button type="submit" class="delete-btn">&times;</button>
        </form>
      </div>
    </div>
    `
  }
  adminTweets.innerHTML += finalTemplate 
}