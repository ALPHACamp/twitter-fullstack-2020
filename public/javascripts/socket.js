const socket = io()

// message from server

console.log('hi')
socket.emit('message', 'Hi! Robby');

socket.on('chat', data => {
  console.log('Get chat')
  console.log(data)
  // socket.emit('message', 'Hi! Robby');
})

// get history messages
socket.on('history', data => {
  data.forEach(message => {
    // console.log(message)
    chatmessage.innerHTML += `
      <div class="media w-50 mb-3">
        <img src="${message.avatar}" alt="user"
          width="50" class="rounded-circle">
        <div class="media-body ml-3">
          <div class="bg-light rounded py-2 px-3 mb-2">
            <p class="text-small mb-0 text-muted">${message.text}</p>
          </div>
          <p class="small text-muted">${message.time}</p>
        </div>
      </div>
    `
  });
})

socket.on('message', (data) => {
  console.log(data);
});


document.querySelector('#button-addon2').addEventListener('click', () => {
  Send();
  console.log('send!')
});

function Send() {
  let msg = document.querySelector('#msg').value;
  if (!msg) {
    alert('請輸入訊息!');
    return;
  }
  let data = {
    msg: msg,
  };
  socket.emit('message', appendData(msg));
  document.querySelector('#msg').value = '';
}


function appendData(data) {

  chatmessage.innerHTML += `
            <div class="send-msg w-50 ml-auto mb-3">
              <div class="media-body">
                <div class=" rounded py-2 px-3 mb-2" style="background: #ff6600;">
                  <p class="text-small mb-0 text-white">${data}</p>
                </div>
                <p class="small text-muted">${moment(data.time).fromNow()}</p>
              </div>
            </div>
          `
}