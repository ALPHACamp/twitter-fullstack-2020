
var socket = io();   //Notice that I’m not specifying any URL when I call io(), since it defaults to trying to connect to the host that serves the page.
$('form').submit(function (e) {
  e.preventDefault(); // prevents page reloading
  const object = {
    type: $('#type').val(),
    body: {
      type: "txt",
      msg: $('#m').val()
    },
    fromId: $('#id').val(),
    toId: $('#toId').val(),
    name: $('#name').val(),
    avater: $('#avater').val(),
  }
  socket.emit('chat message', object);
  $('#m').val('');
  return false;
});
//保存訊息在頁面上
socket.on('chat message', function (object) {
  msg = object.body.msg
  // $('#messages').append($('<li>').text(msg));
  $('#messages').append(`<li><img src="${object.avater}" alt="" style="width: 50px; height:50px">${msg}</li>`);
});
