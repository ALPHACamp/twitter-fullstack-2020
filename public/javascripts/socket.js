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
  console.log(data)
  data.forEach(message => {
    console.log(message)
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