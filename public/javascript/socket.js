$(function () {
  const socket = io().connect()

  $('form').submit(event => {
    event.preventDefault()
    socket.emit('chat message', $('#m').val())
    $('#m').val('')
    return false
  })

  socket.on('chat message', msg => {
    $('#messages').append($('<li>').text(msg));
  })
})



