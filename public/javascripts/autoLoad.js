const adminTweets = document.querySelector('.admin-tweets-list')
const body = document.querySelector('body')
const html = document.querySelector('html')
let limitScroll = 1

// let local = process.env.HEROKU || 'http://localhost:3000'


if (adminTweets) {
  window.addEventListener('scroll', (e) => {
    const adminItem = document.querySelectorAll('.admin-list-item')
    const clientHeight = adminTweets.clientHeight;
    const scrollTop = html.scrollTop;
    const scrollHeight = html.scrollHeight;

    if ((scrollTop + clientHeight >= (scrollHeight * 0.9)) && limitScroll === 1) {
      limitScroll = 0
      axios
        .get(`https://morning-reef-66722.herokuapp.com/api/admin/tweets/${adminItem.length}`)
        .then(data => {
          limitScroll = 1
          tweetTemplate(data.data)
        })
        .catch(() => { return console.log('Load error') })
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
         <button type="button" class="delete-btn" data-toggle="modal" data-target="#e${data[i].id}">
          &times;
        </button>
      </div>
    </div>

     <!-- Modal -->
    <div class="modal fade" id="e${data[i].id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <div class="row align-items-center mx-0">
              <i class="fa fa-exclamation-triangle mr-2" aria-hidden="" style="color:red;"></i>
              <h5 class="modal-title" id="exampleModalLabel">warning!!!</h5>
            </div>

            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            請確認是否刪除這則推文:
            <div>${data[i].description}</div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <form action="/admin/tweets/${data[i].id}?_method=DELETE" method="POST">
              <button type="submit" class="delete-btn btn btn-danger">Delete</button>
            </form>
          </div>
        </div>
      </div>
    </div>
    `
  }
  adminTweets.innerHTML += finalTemplate
}