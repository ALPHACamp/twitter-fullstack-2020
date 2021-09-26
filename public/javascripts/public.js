//connect to socket.io
var socket = io({ 'timeout': 5000, 'connect timeout': 5000 });
const onlinePeople = document.getElementById('onlinePeople')
const onlineCounts = document.getElementById('onlineCounts')
const publicPeople = document.getElementById('publicPeople')
const board = document.getElementById('board')
const publicboard = document.getElementById('publicboard')
//check for connection
if (socket !== undefined) {
    console.log('Connected to socket...')
}
socket.emit('login')

//監聽來自server端的事件名稱 onlineUsers
socket.on('onlineUsers', (onlineUsers) => {
  onlineUsers.forEach(data => {
    const rawHtml = `
      <div class="row justify-content-start align-items-center px-2 py-1 rounded hovercard"
                style="border: 1px solid rgba(0, 0, 0, 0.1); margin-bottom: 3px;"
                onclick="location.href='/users/${data.id}'">
                <div class="col-2 d-flex justify-content-center align-items-center" id="onlineUsers">
                  <img src="${data.avatar}"
                    width="50" height="50" class="rounded-circle">
                </div>
                <div class="col-6 d-flex" style="height: 60px;">
                  <h5 style="line-height: 60px; font-size: 15px; font-weight: bold;">${data.name}</h5>
                  <p class="text-muted ps-2"
                    style="font-size: 15px; line-height: 60px; font-weight: 500; color:#657786;">
                    @${data.account}</p>
                </div>
              </div>
    `
    onlinePeople.innerHTML += rawHtml
  })
  publicPeople.scrollTo(0, publicPeople.scrollHeight) 
})

//監聽來自server端的事件名稱 onlineCounts
socket.on('onlineCounts', (counts) => {
  onlineCounts.innerText = counts
})
//監聽來自server端的事件名稱 onlineUserPop
socket.on('onlineUserPop', (userPop) => {
  let onlineUserPop = document.createElement('ul')
  onlineUserPop.classList.add('list-group', 'd-flex', 'flex-column', 'align-items-center')
  onlineUserPop.innerHTML = `
      <li class="list-group-item mt-2 btn-sm" style="background-color:lightgray;border-radius: 30px 30px 30px 30px;">${userPop} 上線了</li>
    `
  board.appendChild(onlineUserPop)
  publicboard.scrollTo(0, publicboard.scrollHeight)
})

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');
form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

socket.on('chat message', function (msg) {
  var item = document.createElement('div');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});                  