const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const userName = document.querySelector('#chat-user-name').innerText
const userId = document.querySelector('#chat-user-id').innerText

console.log('into public/javascripts/line7...')

socket.on('connect', () => {
  let msgObj = {
    senderId: userId,
    senderName: userName,
    channel: 'chat message',
    behavior: 'inout',
    message: 'is entering',
    createdAt: new Date()
  }
  socket.emit('chat message', msgObj);

  socket.on(`history-${userId}`, chats => {
    chats.forEach(chat => {
      console.log(`${chat.User.name}: ${chat.message}`)
    })
  })

  socket.on('chat message', msgObj => {
    if (msgObj.behavior === 'inout') {
      console.log(`${msgObj.senderName} ${msgObj.message}`)
    }
    if (msgObj.behavior === 'live-talk') {
      console.log(`${msgObj.senderName}: ${msgObj.message}`)
    }
  });

  form.addEventListener('submit', function (e) {
    console.log('-- enable addEventListener...')
    e.preventDefault();
    if (input.value) {
      msgObj = {
        senderId: userId,
        senderName: userName,
        channel: 'chat message',
        behavior: 'live-talk',
        message: input.value,
        createdAt: new Date()
      }
      socket.emit('chat message', msgObj);
      console.log('-- sent message obj =', msgObj)
    }
  });
})




