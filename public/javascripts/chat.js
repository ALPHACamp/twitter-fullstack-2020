
var socket = io();   //Notice that I’m not specifying any URL when I call io(), since it defaults to trying to connect to the host that serves the page.
// $('form').submit(function (e) {
//   e.preventDefault(); // prevents page reloading
//   socket.emit('chat message', $('#m').val());
//   $('#m').val('');
//   return false;
// });
//保存訊息在頁面上
socket.on('chat message', function (msg) {
  console.log("msg=", msg)
  // $('#messages').append($('<li>').text(msg));
  // $('#messages').append(`<li><img src="https://i.imgur.com/X8ykFH1.gif" alt="" style="width: 50px; height:50px">${msg}</li>`);
})
