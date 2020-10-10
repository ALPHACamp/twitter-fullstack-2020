const socket = io();
const mainChat = document.querySelector('.chat-main');
const chatOutput = document.getElementById('output');
const chatForm = document.getElementById("chat-form");
const onlineUserColumn = document.querySelector(".online-user-column");
let onlineUsers = []

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