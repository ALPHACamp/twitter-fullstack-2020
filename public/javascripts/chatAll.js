var socket = io();
var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');

socket.on('connect', () => {
  displayMessage(`You connected with id: ${socket.id}`)

  socket.on('chat message', displayMessage);

  // socket.emit('custom-event', 10, 'Hi', { a: 'a' })

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
      socket.emit('chat message', input.value);
      input.value = '';
    }
  });
})

function displayMessage(msg) {
  var item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
}
