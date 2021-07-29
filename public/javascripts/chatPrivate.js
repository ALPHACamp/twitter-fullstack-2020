const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');

//從 hbs 抓到 sender 和 receiver
const userId = document.querySelector('#chat-user-id').innerText
const receiverId = document.querySelector('#chat-receiver-id').innerText

const record = document.querySelector('#record')
const broadcast = document.querySelector('#broadcast')
// const privateUsers = document.querySelector('#private-user-list')

console.log('into public/javascripts/chatPrivate...line11...userId', userId)

function roomNameGenerator(id1, id2) {
  const numA = Number(id1)
  const numB = Number(id2)
  return numA < numB ? `R-${numA}-${numB}` : `R-${numB}-${numA}`
}

socket.on('connect', () => {
  // 打包一份資料
  let msgObj = {
    senderId: userId,
    channel: 'private',
    behavior: 'inout',
    message: 'is entering',
    createdAt: new Date()
  }
  const room = roomNameGenerator(userId, receiverId)

  //廣播這個資料給 server 讓它知道我來了
  socket.emit('private', msgObj, room);

  //接收 server 傳來的歷史記錄
  socket.on(`history-${userId}`, chats => {
    record.innerHTML = ''
    chats.forEach(chat => {
      if (chat.User.id.toString() === userId) {
        record.innerHTML += `
        <div id="my-message">
          <div>
            <p>${chat.message}</p>
            <img src="${chat.User.avatar}" style="width: 40px;height:40px;" class="rounded-circle m-1">
          </div>
          <p>${chat.createdAt}</p>
        </div>
      `
      } else {
        record.innerHTML += `
        <div id="others-message">
          <div>
            <img src="${chat.User.avatar}" style="width: 40px;height:40px;" class="rounded-circle m-1">
            <p>${chat.message}</p>
          </div>
          <p>${chat.createdAt}</p>
        </div>
      `
      }
    })
    window.scrollTo(0, document.body.scrollHeight)
  })

  //接收聊天室的訊息
  socket.on('private', msgObj => {
    //當有人在講話的時候
    console.log('into public/javascripts/chatPrivate.js/line95....private detected')
    if (msgObj.senderId.toString() === userId) {
      broadcast.innerHTML += `
        <div id="my-message">
          <div>
            <p>${msgObj.message}</p>
            <img src="${msgObj.senderAvatar}" style="width: 40px;height:40px;" class="rounded-circle m-1">
          </div>
          <p>${msgObj.createdAt}</p>
        </div>
      `
    } else {
      broadcast.innerHTML += `
        <div id="others-message">
          <div>
            <img src="${msgObj.senderAvatar}" style="width: 40px;height:40px;" class="rounded-circle m-1">
            <p>${msgObj.message}</p>
            </div>
          <p>${msgObj.createdAt}</p>
        </div>
      `

    }
    window.scrollTo(0, document.body.scrollHeight)
  })

  form.addEventListener('submit', function (e) {
    console.log('-- enable addEventListener...')
    e.preventDefault();
    if (input.value) {
      msgObj = {
        senderId: userId,
        channel: 'private',
        behavior: 'live-talk',
        message: input.value,
        createdAt: new Date()
      }
      socket.emit('private', msgObj, room)
      input.value = ''
      // console.log('-- sent message obj =', msgObj)
    }
  });
})




