const socket = io()
socket.on('connection')
const send = document.getElementById('send')
const broad = document.getElementById('broad')

send.addEventListener('click', function (e) {
  e.preventDefault()
  const input = document.getElementById('message')
  const name = document.getElementById('name')
  if (input.value) {
    socket.emit('message', { user: name.textContent, msg: input.value })
    input.value = '';
  }
})

socket.on('message', (data) => {
  let h2 = document.createElement('h2')
  h2.innerHTML = data.user + ': ' + data.msg
  broad.appendChild(h2)
})

