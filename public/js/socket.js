const socket = io();
const input = document.querySelector('#input');
const typing = document.querySelector('.typing');
const mainChat = document.querySelector('.chat-main');
const chatOutput = document.getElementById('output');
const chatForm = document.getElementById("chat-form");
const onlineUserColumn = document.querySelector(".online-user-column");
let onlineUsers = []
// history message
socket.on('history', data => {
  for (let i = 0; i < data.length; i++) {
    // if (data[i].currentUser === true) {
    //   output.innerHTML += `
    //   <div class="self-message">
    //       <div class="self-text">${data[i].message}</div>
    //       <div class="chat-time">${data[i].time}</div>
    //     </div>
    //   `
    // }
    // else {
      output.innerHTML += `
        <div class="chat-message">
          <div class="chat-avatar" style="background: url('${data[i].avatar}'),#C4C4C4; background-position:center;background-size:cover;">
            </div>
          <div class="column">
            <div class="chat-text"><span>${data[i].name} :</span>${data[i].message}</div>
            <div class="chat-time">${data[i].time}</div>
          </div>
        </div>
      `
    // }
  }

  chatOutput.scrollTop = chatOutput.scrollHeight
})
// listening user typing
socket.on('typing', data => {
  if (data.isExist) {
    typing.innerHTML = `${data.name} is typing...`
  } else {
    typing.innerHTML = ''
  }
})
// user come in
socket.on('message', data => {
    const div = document.createElement("DIV");
    div.classList.add("chat-message");
    div.innerHTML = `<div class="broadcast"><div><span>${data}</span></div></div>`;
    chatOutput.appendChild(div);
    mainChat.scrollTop = mainChat.scrollHeight;
})
socket.on('onlineUsers', data => {
    onlineUsers.push(data)
    let allItem = ``
    for (let i = 0; i < data.length; i++) {
      allItem += `
        <div class="online-user-item">
          <div class="online-user-avatar"
            style="background: url('${data[i].avatar}'),#C4C4C4; background-position:center;background-size:cover;">
          </div>
          <div class="online-user-name">${data[i].name} <span>@${data[i].account}</span></div>
        </div>
      `
    }
    onlineUserColumn.innerHTML = allItem
  })
// msg back from server
socket.on('chat', data=>{
    outputMessage(data);
    mainChat.scrollTop = mainChat.scrollHeight;
})

// Event Listener
chatForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    // user send msg to server
    socket.emit('chatMessage', input.value);
    input.value = '';
    // socket.emit('typing', { isExist: false })
    return false
})
input.addEventListener('input', (e) => {
  if (e.target.value) {
    socket.emit('typing', { isExist: true })
  } else {
    socket.emit('typing', { isExist: false })
  }
})
// Public Fuctions
function outputMessage(data){
    // if(data.currentUser === true){
    //     const div = document.createElement("DIV");
    //     div.classList.add("self-message");
    //     div.innerHTML = `
    //     <div class="self-text">${data.message}</div>
    //     <div class="chat-time">${data.time}</div>`;
    //     chatOutput.appendChild(div);
    // }else{
        const div = document.createElement("DIV");
        div.classList.add("chat-message");
        div.innerHTML = `
        <div class="chat-avatar" style="background: url('${data.avatar}'),#C4C4C4; background-position:center;background-size:cover;"></div>
        <div class="column">
        <div class="chat-text"><span>${data.name} :</span>${data.message}</div>
        <div class="chat-time">${data.time}</div>
        </div>`;
        chatOutput.appendChild(div);
    // }
}