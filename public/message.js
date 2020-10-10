var socket = io()

const chatForm = document.getElementById('chat-form')
const chatMessages = document.getElementById('chat-messages')


chatForm.addEventListener('submit', e => {
  e.preventDefault()
  const msg = e.target.elements.message.value
  socket.emit('chatMessage', msg)

  //clear inputs
  e.target.elements.message.value = ''
})
//const helpers = require('../_helpers')

socket.on('chatMessage', (data) => {
  appendData(data)
  console.log(data)
  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight
});

function appendData(data) {


  const el = document.getElementById('chat-messages')
  let htmlString
  htmlString = `<img src="${data.avatar}" class="user-avatar"> ${data.message}`
  //console.log(helpers.getUser(req).id)
  //console.log('c')
  // if (data.id === req.user.id) {
  //   console.log('b')
  //   htmlString = `${data.message}`
  // } 
  // else {
  //   console.log('a')
    htmlString = `
    <div class="flex-container">
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
  // }
  el.appendChild((document.createElement('div'))).innerHTML = htmlString
}
