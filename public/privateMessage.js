var socket = io()

const chatForm = document.getElementById('chat-form')
const chatMessages = document.getElementById('chat-messages')

chatForm.addEventListener('submit', e => {
  e.preventDefault()
  const msg = e.target.elements.message.value
  socket.emit('joinRoom', msg)

  //clear inputs
  e.target.elements.message.value = ''
})

socket.on('privateMessage', (data) => {
  appendData(data)
  console.log(data)
  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight
});

function appendData(data) {
  //chat message
  const loginUserId = document.getElementById('loginUserId').value
  const el = document.getElementById('chat-messages')
  let htmlString
  if (Number(data.id) === Number(loginUserId)) {
    htmlString = `
      <div class="m-2">
        <section style="background-color:coral; float: right; width:270px; border-radius:20px; padding:6px; float:right;">
          ${data.message}
        </section>
        <font class="text-muted" size="2px" style="float: right;">${data.time}</font>
        <div class="clearfix"></div>
      </div>
    `
  } 
  else {
    htmlString = `
    <div class="flex-container m-2">
      <div>
        <img src="${data.avatar}" class="user-avatar" style="margin-right:4px;">
      </div>
      <div>
      <section style="background-color:lightgrey; float: right; width:270px; border-radius:20px; padding:6px;">
        ${data.message}
      </section>
        
      <font class="text-muted" size="2px">${data.time}</font>
    </div>

    `
  }
  el.appendChild((document.createElement('div'))).innerHTML = htmlString
}