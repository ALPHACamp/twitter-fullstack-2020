
var socket = io();   //Notice that I’m not specifying any URL when I call io(), since it defaults to trying to connect to the host that serves the page.
// socket.emit('open', "update loginTime");
socket.emit('open', "update loginTime");

//更新目前線上使用者
// socket.on('update_loginUsers', function (object) {
//   let text = `
//     <div class="row my-0 py-3" style="border-bottom: 1px solid #C0C0C0">
//       <h6>上線使用者 (${object.length})</h6>
//     </div>
//   `
//   for (let obj of object) {
//     text = text + `123
//     <div class="row my-0 py-3" style="border-bottom: 1px solid #C0C0C0">
//       <div class="d-flex mx-auto">
//         <a class="mx-2" href="/user/${obj.id}">
//           <img src="${obj.avatar}" alt="" style="height: 40px; width: 40px; border-radius: 50%;">
//         </a>
//         <h6 class="fw-bolder" style="margin:0;">${obj.name}$</h6>
//         <h6 style="margin:0; color:#A39480;">${obj.email}$</h6>
//       </div>
//       <h6 style="margin:0; color:#A39480;">${obj.logintimeAt}$</h6>
//     </div>
//     `
//   };
//   $('#global_loginuser').innerHTML = text
// });

//發送聊天訊息
$('#globalchat').submit(function (e) {
  e.preventDefault(); // prevents page reloading
  const object = {
    type: $('#type').val(),
    body: {
      type: 'txt',
      msg: $('#m').val()
    },
    fromId: $('#id').val(),
    toId: $('#toId').val(),
    name: $('#name').val(),
    avatar: $('#avatar').val()
  }
  socket.emit('chat message', object);

  $('#m').val('');

  if (object.toId !== "") {
    socket.emit('push_to_other', object);
  }
  return false;
});

//保存訊息在頁面上
socket.on('chat message', function (object) {
  console.log(object)
  msg = object.body.msg
  if (($('#id').val() === object.fromId && $('#toId').val() === object.toId) || ($('#id').val() === object.toId && $('#toId').val() === object.fromId) || object.toId === "") {
    $('#messages').append(`<li><img src="${object.avatar}" alt="" style="width: 50px; height:50px">${msg}</li>`);
  }
});

socket.on('push_to_other', function (obj, messages) {
  if (obj.toId === $('#global_userId').val()) {
    $('#messages').append("激發新對話框")
  }
});


