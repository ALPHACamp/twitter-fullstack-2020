const socket = io()
socket.on('connection')
const send = document.getElementById('send')
const board = document.getElementById('broad')

send.addEventListener('click', function (e) {
  e.preventDefault()
  const input = document.getElementById('message')
  const name = document.getElementById('name')
  const id = document.getElementById('id')
  if (input.value) {
    socket.emit('message', { id: Number(id.textContent), user: name.textContent, msg: input.value })
    input.value = '';
  }
})

socket.on('message', (data) => {
  let h2 = document.createElement('h2')
  h2.innerHTML = data.user + ': ' + data.msg + ' ' + data.time
  board.appendChild(h2)
  board.scrollTo(0, board.scrollHeight)
})
